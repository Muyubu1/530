# Kararlar

## D1 — Yeni temiz proje (mevcut refactor yerine)

**Bağlam:** 5.30 Lab Lovable üretimi; iç içe, tekrarlı kod (örn. uye.topluluk.tsx 3289 satır, uye.index'te kart 2x kopya).
**Karar:** Sıfırdan `refactor530` kur; tasarımı şablon olarak taşı, eskisi referans kalsın.
**Sonuç:** Teknik borç bulaşmaz; SOLID katmanlar baştan kurulur.

## D2 — Stack: TanStack Start korunur, Lovable çıkar

**Bağlam:** Ekranlar TanStack Router/Start için yazılmış; Next'e geçmek routing'i baştan yazmak demek.
**Karar:** TanStack Start 1.168 + React 19 + Tailwind v4 + Supabase (native auth) + Stripe + Zod. `@lovable.dev/*` paketleri ve `@lovable.dev/vite-tanstack-config` wrapper'ı çıkarıldı; vite config elle kuruldu.
**Sonuç:** Vendor lock yok; config şeffaf. E-posta sonra Resend+React Email ile (Faz 3).

## D3 — Katmanlı mimari + boundaries zorlaması

**Bağlam:** Eski kodda supabase çağrıları component içinde dağınık.
**Karar:** `domain` (saf) → `application` (use-case) → `infrastructure` (Supabase/Stripe impl); `ui` ayrı. Bağımlılık içe doğru. `eslint-plugin-boundaries` ile derleyici düzeyinde zorlanır.
**Durum:** boundaries kuralı şimdilik **warn**; Faz 3'te (gerçek cross-layer wiring oluşunca) **error**'a çekilecek.

## D4 — Tasarım tokenları tek kaynak

**Karar:** Tüm renk/font/animasyon `src/ui/design-system/tokens.css`'te. `src/styles.css` sadece Tailwind girişi + import. Component'lerde ham değer (hardcoded oklch vb.) yasak; token kullanılır.
**Sonuç:** DRY; tek yerden tema kontrolü.

## D6 — Önce lokal Postgres, sonra Supabase (ports & adapters)

**Bağlam:** Kullanıcı Supabase'den önce lokal PostgreSQL bağlamak istedi.
**Karar:** domain repository **arayüzü** (port) sabit; infrastructure'da Postgres **adapter**'ı. Supabase'e geçince yalnızca adapter değişir, domain/application'a dokunulmaz (DIP).
**Yapı:** domain (port) → application (use-case) → infrastructure (.server.ts adapter) → `server/` composition root (createServerFn) → ui/route. ui/routes infrastructure'ı ASLA doğrudan import etmez; sadece server fn çağırır. `eslint-plugin-boundaries` = **error**.
**DB:** lokal `refactor530` (postgres driver), `scripts/migrate.mjs` SQL migration runner, `.env` DATABASE_URL (dotenv). Postgres erişimi sadece `*.server.ts` içinde.

## D7 — Auth Supabase'e ertelendi

**Bağlam:** Lokal custom auth (password hash/session) Supabase auth gelince atılır.
**Karar:** Auth'u Supabase fazına ertele. Üye ekranlarını şimdilik geçici dev-session (mock kullanıcı) ile kur; içerik veri katmanı (courses/lessons/events repo'ları) Supabase'e aynen taşınır.

## D8 — Client-side auth yerleşimi (ui-shared adapter)

**Bağlam:** Auth tarayıcıda çalışır (supabase-js, localStorage session) ama `infrastructure` server-only ve ui/routes onu import edemez.
**Karar:** Port `domain/auth.ts`'te; somut adapter + browser Supabase client + `AuthProvider`/`useAuth` → `src/ui/shared/auth/` (client concern). ui→ui legal olduğu için boundary deliği yok; DIP korunur (ekranlar porta context üzerinden bağımlı). Server-only DB infrastructure değişmez.
**Not:** Browser client **lazy** (`getSupabaseBrowser()`) — modül yüklenince createClient çağırırsa SSR'da realtime/WebSocket patlıyor. Bkz. gotchas G5.

## D9 — Auth Supabase, içerik lokal Postgres (hibrit)

**Karar:** Bu fazda sadece auth + waitlist Supabase'e geçti; courses/lessons/events lokal Postgres'te kaldı (server-side authenticated okuma service-role/JWT forwarding gerektirir — sonraki faz). Gate satın-alma şartlı (`email_has_purchase` RPC, mevcut projede var). Waitlist swap = composition root'ta tek satır (`server/waitlist.ts`), ports&adapters'ın kanıtı.

## D5 — Node 20 / engine uyarısı

**Bağlam:** `@tanstack/start-storage-context` node>=22.12 istiyor; makinede node 20.19.4.
**Karar:** Şimdilik node 20 ile devam — dev+SSR+build sorunsuz çalışıyor (uyarı zararsız). Sorun çıkarsa node 22'ye geçilecek. Bkz. gotchas.
