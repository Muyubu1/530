-- Deterministic seed for local development. Idempotent via fixed UUIDs.

insert into courses (id, title, description, order_index, is_published) values
  ('11111111-1111-1111-1111-111111111111', '28 Günlük Başlangıç',
   'Disiplinini, bedenini ve zihnini yeniden inşa etmenin ilk 28 günü.', 0, true),
  ('22222222-2222-2222-2222-222222222222', '6 Aylık Dönüşüm',
   'Kalıcı dönüşüm: sürdürülebilir alışkanlıklar ve yeni standartlar.', 1, true)
on conflict (id) do nothing;

insert into lessons (id, course_id, title, description, duration_minutes, order_index) values
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'Şafak Disiplini — 05:30', 'Günü kazanan ilk karar: erken kalkmak.', 12, 0),
  ('aaaaaaaa-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
   'Beden: İlk Hareket', 'Bedeni uyandıran temel rutin.', 18, 1),
  ('aaaaaaaa-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111',
   'Zihin: Sessiz Sabah', 'Gürültüden önce zihni hizalamak.', 15, 2),
  ('aaaaaaaa-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111',
   'Sistem: Günlük Ritüel', 'Tekrarlanabilir bir günlük sistem kurmak.', 20, 3),
  ('aaaaaaaa-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111',
   'Kardeşlik ve Hesap Verebilirlik', 'Sözünü tutmak ve yanında durmak.', 16, 4),
  ('bbbbbbbb-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222',
   'Standartlar', 'Kalabalığa değil, kendine hesap vermek.', 22, 0),
  ('bbbbbbbb-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222',
   'Dayanıklılık İnşası', 'Zor günlerde ayakta kalmak.', 25, 1),
  ('bbbbbbbb-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222',
   'İrade ve Süreklilik', 'Motivasyon değil, sistem.', 19, 2),
  ('bbbbbbbb-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222',
   'Yeni Sen', 'Sıradan adamdan sıra dışı adama.', 21, 3)
on conflict (id) do nothing;

insert into events (id, title, description, starts_at, location, link) values
  ('e0000000-0000-0000-0000-000000000001', '5.30 Haftalık Spor Toplanması',
   'Birlikte ter, birlikte standart.', '2026-06-15 14:00:00+03', 'İstanbul, Beylikdüzü', null),
  ('e0000000-0000-0000-0000-000000000002', 'Aylık Mentörlük Buluşması',
   'Sorularını sor, yol haritanı netleştir.', '2026-07-01 19:00:00+03', 'Online', null),
  ('e0000000-0000-0000-0000-000000000003', 'Kardeşlik Kampı',
   'İki gün, tek standart.', '2026-08-20 09:00:00+03', 'Bolu', null)
on conflict (id) do nothing;
