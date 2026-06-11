create table if not exists lesson_materials (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons (id) on delete cascade,
  title text not null,
  file_url text not null,
  file_type text,
  file_size_bytes bigint,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_lesson_materials_lesson on lesson_materials (lesson_id, order_index);

-- Seed (public sample PDF) on the first lesson of "28 Günlük Başlangıç".
insert into lesson_materials (id, lesson_id, title, file_url, file_type, file_size_bytes, order_index) values
  ('f0000000-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001',
   '5.30 Sabah Rutini', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'pdf', 13264, 0),
  ('f0000000-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001',
   'Haftalık Takip Şablonu', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'pdf', 8192, 1)
on conflict (id) do nothing;
