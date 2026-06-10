create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cover_image text,
  order_index integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses (id) on delete cascade,
  title text not null,
  description text,
  video_url text,
  thumbnail_url text,
  duration_minutes integer,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_lessons_course_order on lessons (course_id, order_index);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_at timestamptz not null,
  location text,
  link text,
  created_at timestamptz not null default now()
);
