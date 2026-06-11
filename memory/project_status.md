# Proje Durumu

## Genel hedef

5.30 Lab'in arayüzünü (cinematic mono tasarım) yeni temiz bir projeye taşımak — DRY, SOLID,
modül-modül. Ardından "Patika" (Duolingo-vari yolculuk takibi) özelliğini eklemek.

## Şu an: Faz 9 (fiyat-kontrol) bitti — eski sistemin görünür ekranları TAMAM

Tasarım, public, auth, üye alanı (+materyaller/avatar/admin: bekleme-listesi & fiyat-kontrol/abonelik),
chat, Stripe ödeme tamam. **Kalanlar dış kuruluma bağlı:** içerik→Supabase (deploy ön-koşulu),
e-posta+unsubscribe (Resend), deploy. Bunlar kullanıcının Supabase bağlantısı/Stripe anahtarı/SMTP
kurulumunu bekliyor. **Patika** (asıl hedef) — existing bitince sıra ona; mevcut stack'le başlanabilir.
Ön-koşullar: avatars bucket, admin rolü (user_roles), Stripe sk/pk.

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
