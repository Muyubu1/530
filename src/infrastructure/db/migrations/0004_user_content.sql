-- User-scoped learning data. `user_id` is the Supabase auth user id (no local
-- auth.users table, so no FK on it). `lesson_id` references local content.

create table if not exists completed_lessons (
  user_id uuid not null,
  lesson_id uuid not null references lessons (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists saved_lessons (
  user_id uuid not null,
  lesson_id uuid not null references lessons (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists lesson_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  lesson_id uuid not null references lessons (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_lesson_notes_user_lesson on lesson_notes (user_id, lesson_id);

create table if not exists updates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  published_at timestamptz not null default now()
);

insert into updates (id, title, content, published_at) values
  ('d0000000-0000-0000-0000-000000000001', 'Yeni bölümler yayında',
   '28 Günlük Başlangıç programına yeni dersler eklendi. Şafak disiplininle devam et.',
   '2026-06-08 09:00:00+03'),
  ('d0000000-0000-0000-0000-000000000002', 'Haftalık buluşma hatırlatması',
   'Bu hafta İstanbul buluşması var. Etkinlikler sayfasından detayları gör.',
   '2026-06-05 18:00:00+03'),
  ('d0000000-0000-0000-0000-000000000003', '5.30 topluluğu büyüyor',
   'Aramıza yeni kardeşler katıldı. Standart yükseliyor.',
   '2026-06-01 07:30:00+03')
on conflict (id) do nothing;
