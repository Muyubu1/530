# Gotchas

## G1 — TanStack sürüm skew
**Semptom:** `npm install` → `No matching version found for @tanstack/router-plugin@^1.168.25`.
**Gerçek sebep:** Paketlerin son sürümleri farklı: react-start 1.168.25, router-plugin 1.168.18, react-router 1.170.x. Hepsini aynı numaraya sabitleme.
**Fix:** router-plugin ^1.168.18, react-start ^1.168.25, react-router ^1.168.25 (caret ile en güncele çözülür). Çalıştı.

## G2 — Node 22 engine uyarısı (zararsız)
**Semptom:** `npm warn EBADENGINE ... @tanstack/start-storage-context required node>=22.12.0, current 20.19.4`.
**Gerçek durum:** Sadece uyarı; dev server, SSR, typecheck, lint hepsi node 20.19.4'te çalışıyor.
**Not:** İleride runtime crash olursa `nvm use 22`. Şimdilik dokunma.

## G3 — vite.config plugin sırası
**Not:** Lovable wrapper kaldırıldığı için elle: `tsConfigPaths → tailwindcss → tanstackStart → viteReact`. Sıra önemli; tanstackStart, viteReact'tan önce.
