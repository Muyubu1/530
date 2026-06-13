# Gotchas

## G10 — Supabase Postgres: pooler şart + email validasyonu
**IPv6:** Direct host `db.<ref>.supabase.co` IPv6-only → bu ortamdan ENOTFOUND. **Çözüm:** Supavisor **pooler** (IPv4): `aws-1-ap-south-1.pooler.supabase.com`, user `postgres.<ref>`, session 5432 / transaction 6543. Host prefix `aws-0` DEĞİL `aws-1` çıktı (tenant not found uyarısıyla bulundu). `prepare:false` zorunlu (transaction pooler). Şifredeki özel karakter URL-encode (`**`→`%2A%2A`).
**Email:** GoTrue signup sahte/MX'siz domain'i reddeder ("Email address invalid") — `@gmail.com` gibi MX'li domain gerekir. Onayı SQL ile geç: `update auth.users set email_confirmed_at=now()`. Roller direkt SQL ile (`insert into user_roles ... 'admin'`).
**Çalıştırma:** dış DB'ye bağlanan komutlar sandbox kapalı (`dangerouslyDisableSandbox`) gerektirir.

## G1 — TanStack sürüm skew

**Semptom:** `npm install` → `No matching version found for @tanstack/router-plugin@^1.168.25`.
**Gerçek sebep:** Paketlerin son sürümleri farklı: react-start 1.168.25, router-plugin 1.168.18, react-router 1.170.x. Hepsini aynı numaraya sabitleme.
**Fix:** router-plugin ^1.168.18, react-start ^1.168.25, react-router ^1.168.25 (caret ile en güncele çözülür). Çalıştı.

## G2 — Node 22 engine uyarısı (zararsız)

**Semptom:** `npm warn EBADENGINE ... @tanstack/start-storage-context required node>=22.12.0, current 20.19.4`.
**Gerçek durum:** Sadece uyarı; dev server, SSR, typecheck, lint hepsi node 20.19.4'te çalışıyor.
**Not:** İleride runtime crash olursa `nvm use 22`. Şimdilik dokunma.

## G5 — Supabase browser client SSR'da patlıyor (lazy şart)

**Semptom:** `/login` vb. 500; `RealtimeClient._initializeOptions → getWebSocketConstructor` (websocket-factory) hatası. createClient modül yüklenince (AuthProvider SSR'da import edince) Node'da WebSocket olmadığı için realtime init fail.
**Fix:** Browser client'ı **lazy** yap — `getSupabaseBrowser()` ilk kullanımda (tarayıcıda) oluşturur; modül import'unda createClient çağrılmaz. Gateway metotları `getSupabaseBrowser()` çağırır. Server waitlist client (`client.server.ts`) eager ama yalnız server'da kullanılır; sorun çıkmadı.

## G6 — Server-side supabase-js Node 20'de WebSocket olmadan çöküyor

**Semptom:** Üye fn'leri (verifyUser → supabaseServer) çağrılınca `Error: Node.js 20 detected without native WebSocket support`. UI'da notlar→error boundary, videolar→sonsuz gate loading. Faz 4'te fark edilmedi çünkü waitlist fn'i hiç çağrılmadı (createServerFn handler'ı sadece invoke edilince yüklenir).
**Gerçek sebep:** supabase-js createClient realtime client kurar; Node<22'de global WebSocket yok → patlar. Browser client lazy olduğu için etkilenmez; SERVER client (`client.server.ts`) eager.
**Fix:** `client.server.ts`'te `import ws from "ws"; globalThis.WebSocket ??= ws;` (realtime kullanmıyoruz, sadece constructor'ı tatmin eder). Regresyon testi: `client.server.test.ts` (getUser bad-token → throw değil, düzgün hata). Ayrıca member yükleme efektlerine + gate hasPurchase'a try/catch eklendi (asılı kalmasın).

## G9 — Avatar & admin ön-koşulları

**Avatar:** yükleme Supabase **`avatars`** bucket'ına yazar (path `{uid}/...`, public). Yoksa "yüklenemedi" toast'ı. Avatar URL'i auth user_metadata.avatar_url'de tutulur (profiles tablosu değil) → onAuthStateChange ile AuthUser.avatarUrl güncellenir. **Admin:** bekleme-listesi `user_roles`'te `admin` rolü ister (kendi rolünü RLS ile görür; waitlist select admin RLS'ine bağlı). Admin değilse sayfa "yetkin yok" gösterir (doğru). Materyaller lokal Postgres'te, dosyalar public URL (seed dummy PDF).

## G8 — Stripe: doğrudan secret key (Lovable proxy yok)

**Not:** Eski uygulama Stripe'a Lovable gateway proxy üzerinden bağlanıyordu (connection key). refactor530 **doğrudan** `STRIPE_SECRET_KEY` (sk_test/sk_live) kullanır — eski "secret" çalışmaz. `.env`'e `VITE_STRIPE_PUBLISHABLE_KEY` (pk) + `STRIPE_SECRET_KEY` (sk) eklenmeli. Tutar Stripe ürün/fiyatından değil **domain/pricing**'den (PaymentIntent amount=amountTRY\*100) → Stripe dashboard'da ürün kurmaya gerek yok. Test kartı: 4242 4242 4242 4242. Webhook ertelendi (purchases kaydı client-side, RLS anon insert).

## G7 — Chat medya için Supabase storage bucket gerekli

**Not:** Topluluk görsel/ses yükleme `community-uploads` bucket'ına yazar (path `{uid}/...`, RLS path-scoped). Mevcut 5.30 projesinde var. Yoksa Supabase dashboard'dan oluşturulmalı (public read + RLS). Metin/reaksiyon/realtime bucket gerektirmez.

## G3 — vite.config plugin sırası

**Not:** Lovable wrapper kaldırıldığı için elle: `tsConfigPaths → tailwindcss → tanstackStart → viteReact`. Sıra önemli; tanstackStart, viteReact'tan önce.
