# Proje Durumu

## Genel hedef

5.30 Lab'in arayüzünü (cinematic mono tasarım) yeni temiz bir projeye taşımak — DRY, SOLID,
modül-modül. Ardından "Patika" (Duolingo-vari yolculuk takibi) özelliğini eklemek.

## Şu an: Faz 2'ye hazır — Public ekranlar

Tasarım sistemi (Faz 1) bitti. Sıradaki: `ana` (landing), program/satış sayfaları, Stripe ödeme —
ham stil yazmadan `@/ui/design-system` modülleriyle.

## Tamamlanan

- **Faz 0 (İskele):** TanStack Start kurulumu, Lovable çıkarıldı, katman klasörleri,
  eslint-boundaries, tokens.css tek kaynak, app shell. Dev/SSR/typecheck/lint yeşil.
- **Faz 1 (Tasarım sistemi):** primitives (Button, Eyebrow, Heading/GradientText, Section/Container,
  Card, FeatureList, GlowHalo, Divider, Wordmark, Reveal) + patterns (PageHero, PricingCard,
  MediaCard, EventCard, CinematicVideoFrame) + backgrounds. Barrel `@/ui/design-system`.
  `/playground` görsel katalog. Hepsi token-driven, SSR doğrulandı.

## Sıradaki — Faz 2 (Public)

- `ana.tsx` landing'i yeni modüllerle kur. GuestHeader + Footer ortak bileşenleri henüz taşınmadı —
  Faz 2 başında Wordmark + pill Button ile pattern'e dönüştürülecek.
- Program sayfaları (kisisel/ozel/mentorluk) → PageHero + PricingCard.
- Stripe ödeme akışı → infrastructure (Faz 3 ile örtüşür).

## Son Oturum Notu (2026-06-10)

- Faz 0 + Faz 1 tek oturumda bitti, çalışır halde commit'lendi. Sıradaki oturum Faz 2 ile başlar.
