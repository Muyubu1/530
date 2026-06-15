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

## D10 — Landing 530V2 portu + waitlist'in başvuru sink'ine dönüşmesi

**Bağlam:** Ana sayfa, scroll'a bağlı sinematik bir landing (530V2 statik "DC" HTML) ile değiştirildi. Yeni "Başvur" formu Ad/İletişim(e-posta veya Instagram)/Neden topluyor; mevcut waitlist şeması sadece name/email/phone ve RLS geçerli email zorunlu kılıyordu.
**Seçenekler:** (a) form'u sadece görsel bırak; (b) email zorunlu kıl; (c) şemayı genişlet.
**Karar:** (c). NewWaitlistEntry'ye opsiyonel `contact`+`why`, email opsiyonel. submitWaitlist: contact email-benzeriyse `email`'e de yazar (dedup), ham değer hep `contact`'ta. waitlist tablosu: contact/why kolonları, email nullable, RLS `(email null && contact var) || email-format`. setup.sql + migration 0007_waitlist_application.
**Sonuç:** Tek backend, IG-only başvurular da kaydedilir. Admin bekleme-listesi iletişim+neden sütunları + CSV güncellendi. **DİKKAT:** 0007 Supabase'e uygulanana kadar IG-only (non-email) başvurular RLS'e takılır; email-benzeri contact zaten çalışır.

## D11 — Sinematik landing imperative rAF + Lenis

**Bağlam:** 530V2 deneyimi DOM'u rAF içinde imperative sürüyor (pinned 3D dünya, parallax, motes, grain, light-leak, HUD, per-line reveal) + Lenis smooth scroll.
**Karar:** Tek `useEffect` (mount) içinde port edildi; `rootRef` üzerinden querySelector, cleanup'ta rAF iptal + Lenis.destroy + IO disconnect + listener kaldırma. Lenis npm paketi (CDN değil). Keyframe'ler `styles.css`'te `cine*` prefiksli + `.cine-landing` scope (global sızıntı yok). Görseller `public/landing/`. Header/footer YOK (immersive); üye erişimi için sağ üst diskret `/login`. reduce-motion ve touch dallanmaları korundu.
