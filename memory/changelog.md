# Changelog

- chore: refactor530 iskelesi kuruldu — TanStack Start + React 19 + Tailwind v4, Lovable bağımlılıkları çıkarıldı. Sebep: temiz/SOLID temel. package.json, vite/ts/eslint config
- feat: tasarım tokenları tek kaynağa taşındı. Sebep: DRY, modül-modül tasarım dili. src/ui/design-system/tokens.css + src/styles.css
- feat: app shell (router, \_\_root, index, playground). Sebep: çalışan SSR temeli. src/router.tsx, src/routes/\*
- chore: kalite kapıları — eslint-plugin-boundaries (katman zorlaması, warn), prettier, vitest. Sebep: mimari kuralla korunmalı. eslint.config.js
- feat: tasarım sistemi primitive katmanı — Button(cva), Eyebrow, Heading/GradientText, Section/Container, Card, FeatureList, GlowHalo, Divider, Wordmark, Reveal + Backgrounds taşındı. Sebep: inline/tekrarlı stilleri ortak modüle indir. src/ui/design-system/\*
- feat: /playground bileşen kataloğu — tüm primitive'ler görsel doğrulama. SSR 200, typecheck+lint temiz.
- feat: tasarım sistemi pattern katmanı — PageHero, PricingCard, MediaCard (dashboard 2x kopyanın yerine), EventCard, CinematicVideoFrame. Sebep: feature-seviyesi ortak modüller; ekranlar diziye dizecek. src/ui/design-system/patterns/\*
- feat(faz2): landing (ana) yeni modüllerle kuruldu — SiteHeader/SiteFooter (ui/shared), ProgramScene, HeroParticles/ScrollGlow (hidrasyon-güvenli), Dialog primitive, BarcodeCTA, WaitlistForm (onSubmit enjekte=DIP). pricing domain'e taşındı. Hero/Interlude/Vsl section'ları features/marketing. Stripe/Supabase Faz 3 stub. SSR 200.
