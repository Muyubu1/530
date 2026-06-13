-- Demo topluluk mesajları + reaksiyonlar (idempotent). Direct SQL → RLS etkilemez.
-- Admin uid: 3a46fa17-7bc8-458a-b61d-48089892929d. Diğerleri sentetik (display_name denormalize).

insert into public.community_messages (id, user_id, content, display_name, created_at, reply_to_id, reply_to_name, reply_to_snippet) values
  ('aaaa1111-0000-0000-0000-000000000001', '3a46fa17-7bc8-458a-b61d-48089892929d',
   'Bugün 5.30''da kalktım, üst üste 12. gün. Seri bozulmuyor 🔥', 'Halil', '2026-06-12 05:35:00+03', null, null, null),
  ('aaaa1111-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001',
   'Helal! Ben 7. gündeyim, sabah koşusuna yeni başladım.', 'Mert', '2026-06-12 05:41:00+03', null, null, null),
  ('aaaa1111-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002',
   'Beden & Antrenman programına başlayan var mı? İlk ders çok iyiymiş.', 'Zeynep', '2026-06-12 06:10:00+03', null, null, null),
  ('aaaa1111-0000-0000-0000-000000000004', '3a46fa17-7bc8-458a-b61d-48089892929d',
   'Evet, mobilite dersi favorim. Form önce, ağırlık sonra.', 'Halil', '2026-06-12 06:13:00+03',
   'aaaa1111-0000-0000-0000-000000000003', 'Zeynep', 'Beden & Antrenman programına başlayan var mı?'),
  ('aaaa1111-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003',
   'Dijital detoks dersinden sonra bildirimleri kapattım, odak geri geldi.', 'Emre', '2026-06-12 07:02:00+03', null, null, null),
  ('aaaa1111-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000004',
   'Cuma sahil koşusunda görüşürüz 🌅', 'Ayşe', '2026-06-12 08:15:00+03', null, null, null),
  ('aaaa1111-0000-0000-0000-000000000007', '3a46fa17-7bc8-458a-b61d-48089892929d',
   'Standart yükseliyor. Yarın 5.30 — kimse ertelemiyor.', 'Halil', '2026-06-12 21:30:00+03', null, null, null)
on conflict (id) do nothing;

insert into public.message_reactions (message_id, user_id, emoji) values
  ('aaaa1111-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '🔥'),
  ('aaaa1111-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '🔥'),
  ('aaaa1111-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', '💪'),
  ('aaaa1111-0000-0000-0000-000000000005', '3a46fa17-7bc8-458a-b61d-48089892929d', '👍'),
  ('aaaa1111-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000004', '❤️'),
  ('aaaa1111-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000001', '🔥')
on conflict (message_id, user_id, emoji) do nothing;
