create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null unique,
  phone text,
  source text not null default 'landing',
  created_at timestamptz not null default now()
);
