# Proje Durumu

## Genel hedef

5.30 Lab'in arayüzünü (cinematic mono tasarım) yeni temiz bir projeye taşımak — DRY, SOLID,
modül-modül. Ardından "Patika" (Duolingo-vari yolculuk takibi) özelliğini eklemek.

## Şu an: Faz 3'e hazır — Auth + altyapı

Public yüzey (Faz 2) bitti. Sıradaki: Supabase native auth, repository/service katmanı
(infrastructure), Stripe ödeme akışı, e-posta gateway (Resend). Stub'lar gerçeğiyle değişecek.

## Tamamlanan

- **Faz 0 (İskele):** TanStack Start, Lovable çıkarıldı, katman klasörleri, eslint-boundaries,
  tokens.css tek kaynak, app shell. Dev/SSR/typecheck/lint yeşil.
- **Faz 1 (Tasarım sistemi):** primitives + patterns + backgrounds, barrel `@/ui/design-system`,
  `/playground` katalog. Hepsi token-driven.
- **Faz 2 (Public):** landing (ana) + 3 program sayfası (kisisel/ozel/mentorluk). SiteHeader/Footer
  (ui/shared), ProgramScene (3x tekrar tek modüle), HeroParticles/ScrollGlow, Dialog, BarcodeCTA,
  WaitlistForm (onSubmit enjekte). pricing → domain. 8 route SSR 200.

## Sıradaki — Faz 3 (Auth + altyapı)

- Supabase istemcisi (env: VITE_SUPABASE_URL / _PUBLISHABLE_KEY) — infrastructure katmanı.
- application use-case'leri: SubmitWaitlist, (sonra) PurchasePlan, auth akışları.
- Stripe gateway + ödeme akışı (kisisel/ozel/mentorluk odeme stub'larının yerine).
- WaitlistForm onSubmit'i gerçek Supabase insert'e bağla (route → application → infrastructure).
- E-posta: Resend + React Email, EmailGateway arayüzü.
- boundaries kuralını "warn" → "error" çek (artık cross-layer wiring var).

## Stub'lar / açık uçlar (Faz 3'te kapanacak)

- `/login` placeholder; `/kisisel-program/odeme`, `/ozel-program/odeme`, `/mentorluk/satin-al`
  CheckoutStub. ana route'taki `submitWaitlist` stub "ok" dönüyor (persist etmiyor).
- VSL/mentorluk videoları gerçek asset değil (poster placeholder); Lovable .asset.json'lar taşınmadı.

## Son Oturum Notu (2026-06-10)

- Faz 0+1+2 tek oturumda bitti, çalışır halde commit'lendi (6 commit). Public yüzey tarayıcıda
  test edilebilir: /, /ana, /kisisel-program, /ozel-program, /mentorluk, /playground.
- Sıradaki oturum Faz 3 (auth + Supabase/Stripe/email altyapısı) ile başlar.
