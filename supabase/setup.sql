-- 5.30 — Supabase-native şema kurulumu (yeni proje için, idempotent).
-- Tarayıcı (Supabase JS) tarafının kullandığı tablolar: profiles, user_roles,
-- purchases, waitlist, community_messages, message_reactions + RLS/RPC/trigger + storage.
-- İçerik/kullanıcı-verisi tabloları ayrı (postgres.js migrations 0002–0005).
-- Tekrar çalıştırılabilir.

-- ───────────────────────── roles ─────────────────────────
do $$ begin
  create type public.app_role as enum ('admin', 'member');
exception when duplicate_object then null; end $$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security invoker set search_path = 'public' as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;

drop policy if exists "Users view own roles" on public.user_roles;
create policy "Users view own roles" on public.user_roles
  for select using (auth.uid() = user_id);
drop policy if exists "Admins manage roles" on public.user_roles;
create policy "Admins manage roles" on public.user_roles
  for all using (public.has_role(auth.uid(), 'admin'));

-- ──────────────────────── profiles ───────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  last_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

drop policy if exists "Members view profiles" on public.profiles;
create policy "Members view profiles" on public.profiles
  for select to authenticated using (true);
drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles
  for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = 'public' as $$
begin
  insert into public.profiles (id, display_name, last_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'last_name'
  ) on conflict (id) do nothing;
  insert into public.user_roles (user_id, role)
  values (new.id, 'member') on conflict (user_id, role) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ──────────────────────── purchases ──────────────────────
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now()
);
create unique index if not exists purchases_email_lower_idx on public.purchases ((lower(email)));
alter table public.purchases enable row level security;

drop policy if exists "Anyone can record a valid purchase email" on public.purchases;
create policy "Anyone can record a valid purchase email" on public.purchases
  for insert to anon, authenticated
  with check (
    email is not null and length(email) <= 320
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );

create or replace function public.email_has_purchase(check_email text)
returns boolean language sql stable security definer set search_path = 'public' as $$
  select exists (select 1 from public.purchases where lower(email) = lower(check_email))
$$;
grant execute on function public.email_has_purchase(text) to anon, authenticated;

-- ──────────────────────── waitlist ───────────────────────
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  name text,
  phone text,
  contact text,
  why text,
  source text,
  created_at timestamptz not null default now()
);
-- Application form ("başvur") may carry a non-email contact (e.g. Instagram).
alter table public.waitlist alter column email drop not null;
alter table public.waitlist add column if not exists contact text;
alter table public.waitlist add column if not exists why text;
alter table public.waitlist enable row level security;

drop policy if exists "Anyone can join waitlist" on public.waitlist;
create policy "Anyone can join waitlist" on public.waitlist
  for insert to anon, authenticated
  with check (
    (email is null and contact is not null)
    or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );
drop policy if exists "Admins view waitlist" on public.waitlist;
create policy "Admins view waitlist" on public.waitlist
  for select using (public.has_role(auth.uid(), 'admin'));

-- ──────────────────── community chat ─────────────────────
create table if not exists public.community_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  content text,
  media_url text,
  media_type text check (media_type in ('image', 'audio', 'gif')),
  display_name text,
  avatar_url text,
  reply_to_id uuid references public.community_messages (id) on delete set null,
  reply_to_snippet text,
  reply_to_name text,
  created_at timestamptz not null default now()
);
create index if not exists community_messages_created_at_idx on public.community_messages (created_at desc);
alter table public.community_messages enable row level security;
alter table public.community_messages replica identity full;

drop policy if exists "Members view community messages" on public.community_messages;
create policy "Members view community messages" on public.community_messages
  for select to authenticated using (true);
drop policy if exists "Members insert own messages" on public.community_messages;
create policy "Members insert own messages" on public.community_messages
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Users delete own messages" on public.community_messages;
create policy "Users delete own messages" on public.community_messages
  for delete to authenticated using (auth.uid() = user_id);

create table if not exists public.message_reactions (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.community_messages (id) on delete cascade,
  user_id uuid not null,
  emoji text not null,
  created_at timestamptz not null default now(),
  unique (message_id, user_id, emoji)
);
create index if not exists message_reactions_message_idx on public.message_reactions (message_id);
alter table public.message_reactions enable row level security;
alter table public.message_reactions replica identity full;

drop policy if exists "Members view reactions" on public.message_reactions;
create policy "Members view reactions" on public.message_reactions
  for select to authenticated using (true);
drop policy if exists "Members add own reactions" on public.message_reactions;
create policy "Members add own reactions" on public.message_reactions
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Users remove own reactions" on public.message_reactions;
create policy "Users remove own reactions" on public.message_reactions
  for delete to authenticated using (auth.uid() = user_id);

-- realtime publication (zaten ekliyse yut)
do $$ begin
  alter publication supabase_realtime add table public.community_messages;
exception when others then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.message_reactions;
exception when others then null; end $$;

-- ──────────────────────── storage ────────────────────────
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('community-uploads', 'community-uploads', true)
  on conflict (id) do nothing;

drop policy if exists "Avatar public read" on storage.objects;
create policy "Avatar public read" on storage.objects
  for select using (bucket_id = 'avatars');
drop policy if exists "Users upload own avatar" on storage.objects;
create policy "Users upload own avatar" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
drop policy if exists "Users update own avatar" on storage.objects;
create policy "Users update own avatar" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
drop policy if exists "Users delete own avatar" on storage.objects;
create policy "Users delete own avatar" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Community media public read" on storage.objects;
create policy "Community media public read" on storage.objects
  for select using (bucket_id = 'community-uploads');
drop policy if exists "Members upload community media" on storage.objects;
create policy "Members upload community media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'community-uploads' and auth.uid()::text = (storage.foldername(name))[1]);
drop policy if exists "Users delete own community media" on storage.objects;
create policy "Users delete own community media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'community-uploads' and auth.uid()::text = (storage.foldername(name))[1]);
