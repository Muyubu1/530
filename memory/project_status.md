# Proje Durumu

## Genel hedef

5.30 Lab'in arayüzünü (cinematic mono tasarım) yeni temiz bir projeye taşımak — DRY, SOLID,
modül-modül. Ardından "Patika" (Duolingo-vari yolculuk takibi) özelliğini eklemek.

## Şu an: TEK BACKEND = yeni Supabase (530 / zsyuanrcdkempsjtalim). Landing kökte, içerik dolu.

DATABASE_URL = Supabase **Supavisor pooler** (aws-1-ap-south-1, session 5432; Vercel için transaction
6543, `prepare:false`). setup.sql + migrations 0002–0006 uygulandı. **Landing artık `/`** (eski geçici
hub → `/gecicihub`; `/ana`→`/` redirect). **Zengin tohum**: 4 kurs / 29 ders (görsel+video) / 7 etkinlik /
6 güncelleme / 6 materyal / 7 topluluk mesajı + reaksiyon. **Admin/üye AYRIK**: admin→`/admin` (dashboard

- TAM CRUD CMS: kurslar/dersler/materyaller/etkinlikler/güncellemeler; requireAdmin gate), üye→`/uye`.
  Girişler: admin `admin.530.demo@gmail.com`/`Admin.530.2026`, üye `uye.530.demo@gmail.com`/`Uye.530.2026`.
  Formlarda realtime doğrulama + şifre-göster. **Sıradaki:** **Vercel deploy** — Nitro Vite plugin + Transaction pooler (6543) string

* repo bağla + env. Sonra: gerçek Patika (asıl hedef), e-posta/unsubscribe, içerik yönetim paneli.

## Tamamlanan

- **Faz 0:** İskele · **Faz 1:** Tasarım sistemi · **Faz 2:** Public (landing + 3 program) ·
  **Faz 3a:** Lokal Postgres veri katmanı (waitlist) · **Faz 3b:** Üye alanı (content + 4 ekran).
- **Faz 4:** Supabase auth (login/signup/forgot/reset + Google OAuth), /uye satın-alma gate
  (email_has_purchase), waitlist Postgres→Supabase swap. Mock session kalktı.
- **Faz 5:** Üye alanı tamamlandı — kullanıcı-özel veri (completed/notes/saved) lokal Postgres,
  **token-doğrulamalı** server fn'ler (verifyUser). Ders detayı: tamamla/kaydet/notlar/watch-progress.
  Profil hub + notlar/videolar/ayarlar + güncellemeler + kütüphane. "benim odam" nav aktif.

## Mimari (sabit)

- Veri: `domain` (port) → `application` → `infrastructure` (`*.server.ts`) → `server/` (createServerFn)
  → `routes` (loader) → `ui` (presentational). boundaries=ERROR.
- Auth (client-side): port `domain/auth.ts`; adapter + browser client (lazy) + `AuthProvider`/`useAuth`
  → `src/ui/shared/auth/`. `/uye` gate satın-alma şartlı.
- Komutlar: `npm run dev | build | lint | typecheck | test | format | db:migrate`.
- Env: `.env` (git-ignored) — DATABASE_URL (lokal Postgres) + VITE_SUPABASE_URL/\_PUBLISHABLE_KEY
  (mevcut 5.30 projesi, anon=public). `.env.example` placeholder.

## Manuel test gereken (kullanıcı)

- Login: mevcut Supabase projesinde **purchases'ta kayıtlı** bir e-posta + şifreyle giriş → /uye.
  (Yoksa herkes bounce olur — gate satın-alma şartlı.)
- Google OAuth: Supabase dashboard'da Google provider yapılandırılmalı.
- Waitlist swap: /ana formundan kayıt → eski Supabase `waitlist` tablosuna düştüğünü doğrula.

## Açık uçlar / stub'lar

- İçerik (courses/lessons/events) hâlâ lokal Postgres (Supabase'e geçiş = service-role/JWT, sonra).
- Üye kullanıcı-özel: notes/completed/saved/materials → ders detayına eklenecek.
- Stripe ödeme → CheckoutStub'lar. Topluluk (chat), profil alt sayfaları. Auth e-posta şablonları.
- Postgres waitlist adapter+testi referans olarak duruyor (app artık Supabase kullanıyor).

## Son Oturum Notu (2026-06-10)

- Faz 0→4 tek oturumda (11+ commit). Auth eklendi, waitlist Supabase'e swap'landı (ports&adapters
  kanıtı). Tarayıcı testi: /login, /signup?email=, /forgot-password, /uye (gate), /ana waitlist.

## Son Oturum Notu (2026-06-15)

- Ana sayfa (`/`) tamamen yeni sinematik landing ile değiştirildi (530V2 portu). Detay: changelog
  üst girdisi + decisions D10/D11. Pinned 3D tırmanış + 4 bölüm; eski hero/interlude/vsl/barcode
  sections silindi. `lenis` eklendi, görseller `public/landing/`.
- Başvuru formu mevcut waitlist backend'e bağlandı (contact+why; email opsiyonel).
- **YARIN/KULLANICI:** (1) migration 0007'yi Supabase'e uygula (IG-only başvurular için; SQL
  editöründe `src/infrastructure/db/migrations/0007_waitlist_application.sql`). (2) `npm run dev`
  ile sinematik scroll'u tarayıcıda doğrula (Lenis/parallax/HUD/reveal + form submit + /login linki).
