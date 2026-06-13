-- Zengin demo tohumu — mantıklı Türkçe içerik. Idempotent (on conflict do nothing + null-guard update).
-- Mevcut UUID şeması sürdürülür: courses 1/2, yeni 3/4 (cccc/dddd); lessons aaaa../bbbb../cccc../dddd..;
-- events e0.., updates d0.., materials f0...

-- ───── yeni kurslar ─────
insert into courses (id, title, description, order_index, is_published) values
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Beden & Antrenman',
   'Gücü, dayanıklılığı ve toparlanmayı sistematik kuran beden programı.', 2, true),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Zihin & Odak',
   'Derin odak, dikkat kontrolü ve soğukkanlılık — zihni bir kas gibi çalıştır.', 3, true)
on conflict (id) do nothing;

-- ───── dersler: 28 Günlük Başlangıç (+5) ─────
insert into lessons (id, course_id, title, description, duration_minutes, order_index) values
  ('aaaaaaaa-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'Beslenme: Temiz Yakıt', 'Bedeni besleyen sade beslenme ilkeleri.', 14, 5),
  ('aaaaaaaa-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'Su ve Uyku Ritmi', 'Toparlanmanın iki temel direği.', 13, 6),
  ('aaaaaaaa-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'Dijital Detoks', 'Dikkatini çalan ekranı geri al.', 17, 7),
  ('aaaaaaaa-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', 'Haftalık Değerlendirme', 'Neyi tuttun, neyi kaçırdın — dürüst bak.', 11, 8),
  ('aaaaaaaa-0000-0000-0000-00000000000a', '11111111-1111-1111-1111-111111111111', '28. Gün: Yeni Standart', 'Başlangıç bitti; standart başlıyor.', 20, 9)
on conflict (id) do nothing;

-- ───── dersler: 6 Aylık Dönüşüm (+3) ─────
insert into lessons (id, course_id, title, description, duration_minutes, order_index) values
  ('bbbbbbbb-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 'Aylık Hedef Mimarisi', 'Büyük hedefi aylara böl, ölç.', 23, 4),
  ('bbbbbbbb-0000-0000-0000-000000000006', '22222222-2222-2222-2222-222222222222', 'Geri Bildirim Döngüsü', 'İlerlemeyi gören bir sistem kur.', 18, 5),
  ('bbbbbbbb-0000-0000-0000-000000000007', '22222222-2222-2222-2222-222222222222', 'Topluluk Liderliği', 'Önce kendine, sonra yanındakine örnek ol.', 24, 6)
on conflict (id) do nothing;

-- ───── dersler: Beden & Antrenman (6) ─────
insert into lessons (id, course_id, title, description, duration_minutes, order_index) values
  ('cccccccc-0000-0000-0000-000000000001', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Temel Güç Hareketleri', 'Squat, şınav, çekiş — temeli sağlam at.', 20, 0),
  ('cccccccc-0000-0000-0000-000000000002', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Mobilite ve Esneklik', 'Eklemleri koru, hareket aralığını aç.', 16, 1),
  ('cccccccc-0000-0000-0000-000000000003', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Kardiyo Temelleri', 'Kalbi ve nefesi çalıştır.', 18, 2),
  ('cccccccc-0000-0000-0000-000000000004', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Toparlanma ve Dinlenme', 'Kas dinlenirken büyür.', 14, 3),
  ('cccccccc-0000-0000-0000-000000000005', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Antrenman Programı Kurmak', 'Haftalık bölünmüş bir plan.', 22, 4),
  ('cccccccc-0000-0000-0000-000000000006', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Sakatlanmadan İlerlemek', 'Form önce, ağırlık sonra.', 15, 5)
on conflict (id) do nothing;

-- ───── dersler: Zihin & Odak (6) ─────
insert into lessons (id, course_id, title, description, duration_minutes, order_index) values
  ('dddddddd-0000-0000-0000-000000000001', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Derin Odak (Deep Work)', 'Tek işe, tüm dikkatle.', 19, 0),
  ('dddddddd-0000-0000-0000-000000000002', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Dikkat Dağıtıcılarla Savaş', 'Bildirimleri sustur, ortamı kur.', 15, 1),
  ('dddddddd-0000-0000-0000-000000000003', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Meditasyon Temelleri', 'Nefesle başlayan sabah hizalaması.', 17, 2),
  ('dddddddd-0000-0000-0000-000000000004', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Niyet ve Hedef Netliği', 'Ne istediğini net bil.', 16, 3),
  ('dddddddd-0000-0000-0000-000000000005', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Stres ve Soğukkanlılık', 'Baskı altında sakin kal.', 18, 4),
  ('dddddddd-0000-0000-0000-000000000006', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Akış Hâli (Flow)', 'Zorluk ve beceri dengesi.', 21, 5)
on conflict (id) do nothing;

-- ───── etkinlikler (+4) ─────
insert into events (id, title, description, starts_at, location, link) values
  ('e0000000-0000-0000-0000-000000000004', 'Sabah Koşusu — Sahil', 'Gün doğmadan, birlikte.', '2026-09-05 06:00:00+03', 'İstanbul, Caddebostan', null),
  ('e0000000-0000-0000-0000-000000000005', 'Online Soru-Cevap', 'Yol haritanı netleştir.', '2026-09-12 20:00:00+03', 'Online', 'https://meet.530lab.co/canli'),
  ('e0000000-0000-0000-0000-000000000006', 'Güç Atölyesi', 'Doğru form, güvenli ilerleme.', '2026-09-20 11:00:00+03', 'Ankara', null),
  ('e0000000-0000-0000-0000-000000000007', 'Kış Kampı', 'Üç gün, tek standart.', '2026-12-19 09:00:00+03', 'Kartepe', null)
on conflict (id) do nothing;

-- ───── güncellemeler (+3) ─────
insert into updates (id, title, content, published_at) values
  ('d0000000-0000-0000-0000-000000000004', 'Beden & Antrenman programı yayında', 'Yeni "Beden & Antrenman" programı tüm derslerle birlikte erişimde. Bugün ilk dersinle başla.', '2026-06-11 09:00:00+03'),
  ('d0000000-0000-0000-0000-000000000005', 'Zihin & Odak ile derinleş', 'Dikkatini geri kazan: "Zihin & Odak" programı eklendi. Deep Work ile başla.', '2026-06-10 08:00:00+03'),
  ('d0000000-0000-0000-0000-000000000006', 'Yeni etkinlikler eklendi', 'Sabah koşusu, güç atölyesi ve kış kampı takvimde. Etkinlikler sayfasından yerini ayır.', '2026-06-09 18:30:00+03')
on conflict (id) do nothing;

-- ───── materyaller (+4) ─────
insert into lesson_materials (id, lesson_id, title, file_url, file_type, file_size_bytes, order_index) values
  ('f0000000-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000002', 'Hareket Şablonu', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'pdf', 10240, 0),
  ('f0000000-0000-0000-0000-000000000004', 'cccccccc-0000-0000-0000-000000000001', 'Antrenman Planı (4 Hafta)', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'pdf', 15360, 0),
  ('f0000000-0000-0000-0000-000000000005', 'dddddddd-0000-0000-0000-000000000001', 'Odak Günlüğü', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'pdf', 7168, 0),
  ('f0000000-0000-0000-0000-000000000006', 'bbbbbbbb-0000-0000-0000-000000000001', 'Standartlar Kontrol Listesi', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'pdf', 6144, 1)
on conflict (id) do nothing;

-- ───── görseller (null olanlara deterministik Picsum) ─────
update courses set cover_image = 'https://picsum.photos/seed/c' || left(id::text, 8) || '/1200/675'
  where cover_image is null;
update lessons set thumbnail_url = 'https://picsum.photos/seed/l' || left(id::text, 8) || '/600/400'
  where thumbnail_url is null;

-- ───── örnek video (her programın ilk dersine) ─────
update lessons set video_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  where id = 'aaaaaaaa-0000-0000-0000-000000000001';
update lessons set video_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
  where id = 'bbbbbbbb-0000-0000-0000-000000000001';
update lessons set video_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
  where id = 'cccccccc-0000-0000-0000-000000000001';
update lessons set video_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
  where id = 'dddddddd-0000-0000-0000-000000000001';
