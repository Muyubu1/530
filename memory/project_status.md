# Proje Durumu

## Genel hedef

5.30 Lab'in arayüzünü (cinematic mono tasarım) yeni temiz bir projeye taşımak — DRY, SOLID,
modül-modül. Ardından "Patika" (Duolingo-vari yolculuk takibi) özelliğini eklemek.

## Şu an: Faz 3b bitti — sıradaki karar bekliyor

Üye alanı (dashboard, dersler, ders detayı, etkinlikler) lokal Postgres'e bağlı çalışıyor.
Sıradaki büyük adım kullanıcıya bağlı: **Auth (Supabase)** veya **Topluluk (chat)** veya **Patika**
(yeni özellik) veya **Stripe ödeme**. Auth gelince mock dev-session ve /uye gate gerçeklenecek.

## Tamamlanan

- **Faz 0:** İskele (TanStack Start, Lovable çıktı, boundaries, tokens).
- **Faz 1:** Tasarım sistemi (primitives + patterns + backgrounds, /playground).
- **Faz 2:** Public (landing + 3 program sayfası), 8 route SSR 200.
- **Faz 3a:** Lokal Postgres veri katmanı (ports&adapters), waitlist gerçek persist. boundaries=ERROR.
- **Faz 3b:** Üye alanı — courses/lessons/events veri katmanı + 4 ekran (MemberLayout, dashboard,
  dersler list, ders detayı [salt-okunur], etkinlikler). Mock dev-session. 6 entegrasyon testi.

## Mimari (sabit)

`domain` (port) → `application` (use-case) → `infrastructure` (`*.server.ts` Postgres adapter) →
`server/` (createServerFn composition) → `routes` (loader→server fn) → `ui` (presentational, prop).
ui/routes infrastructure'ı asla import etmez. `eslint-plugin-boundaries = error`.
Komutlar: `npm run dev | build | lint | typecheck | test | format | db:migrate`.

## Açık uçlar / stub'lar

- **Auth yok** (Supabase fazı): mock `getCurrentUser()` `src/server/session.ts`; /uye açık (gate yok).
- Kullanıcıya özel: completed_lessons, lesson_notes, lesson_materials, saved_lessons → ders detayına
  auth gelince eklenecek. Topluluk (chat), profil alt sayfaları → sonra.
- Stripe ödeme → /odeme + satin-al CheckoutStub. Video/thumbnail asset'leri null (placeholder).
- `/login` placeholder.

## Son Oturum Notu (2026-06-10)

- Faz 0→3b tek oturumda bitti (10 commit). Lokal Postgres `refactor530`: waitlist + content çalışıyor.
- Tarayıcı testi: / (hub), /ana, program sayfaları, /uye + /uye/dersler + ders detay + /uye/etkinlikler.
- Sıradaki adımı kullanıcı seçecek (auth / topluluk / patika / ödeme).
