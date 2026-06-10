# refactor530 — Memory Index

5.30 Lab projesinin temiz, SOLID, DRY yeniden inşası. Tasarım `../5.30 Lab_ Dönüşüm Yolculuğu` projesinden şablon olarak alınır; mimari sıfırdan katmanlı kurulur.

## Çekirdek dosyalar

- [project_status.md](project_status.md) — güncel durum, nerede kaldık
- [changelog.md](changelog.md) — her anlamlı değişiklik (1 satır)
- [decisions.md](decisions.md) — mimari/teknik kararlar + gerekçe
- [gotchas.md](gotchas.md) — tricky bug'lar, yanlış varsayımlar

## Bir bakışta

- **Konum:** `/Users/yusufbulut/Desktop/530/refactor530`
- **Şablon kaynağı:** `/Users/yusufbulut/Desktop/530/5.30 Lab_ Dönüşüm Yolculuğu` (el değmez, referans)
- **Stack:** TanStack Start 1.168 + React 19 + Tailwind v4 + Supabase + Stripe + Zod. Lovable bağımlılıkları çıkarıldı.
- **Mimari:** Katmanlı — `domain` → `application` → `infrastructure`, `ui` ayrı. Bağımlılık içe doğru. `eslint-plugin-boundaries` ile zorlanır.
- **Komutlar:** `npm run dev | build | lint | typecheck | test | format`
- **Kalite kuralı:** İç içe/tekrarlı kod yasak. Ekran ekran değil, **modül modül** tasarım. Ortak bileşenler `src/ui/design-system`.

## Faz planı

0. ✅ İskele · 1. ⏳ Tasarım sistemi · 2. Public · 3. Auth+altyapı · 4. Üye paneli · 5. Topluluk · 6. Patika/Journey (yeni özellik)
