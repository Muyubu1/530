# Proje Durumu

## Genel hedef

5.30 Lab'in arayüzünü (cinematic mono tasarım) yeni temiz bir projeye taşımak — DRY, SOLID,
modül-modül. Ardından "Patika" (Duolingo-vari yolculuk takibi) özelliğini eklemek.

## Şu an: Faz 3b'ye hazır — Üye (member) alanı

Veri katmanı (lokal Postgres, ports & adapters) kuruldu ve waitlist ile kanıtlandı. Sıradaki seçilen
ekran: **üye alanı** — content veri katmanı (courses/lessons/events) + dashboard + dersler. Auth
Supabase'e ertelendi; şimdilik geçici dev-session (mock kullanıcı).

## Tamamlanan

- **Faz 0 (İskele):** TanStack Start, Lovable çıkarıldı, katmanlar, eslint-boundaries, tokens.css.
- **Faz 1 (Tasarım sistemi):** primitives + patterns + backgrounds, `/playground`.
- **Faz 2 (Public):** landing + 3 program sayfası; SiteHeader/Footer, ProgramScene; 8 route SSR 200.
- **Faz 3a (Veri katmanı):** lokal Postgres, ports&adapters. waitlist uçtan uca gerçek persist
  (domain→application→infrastructure→server→ui). boundaries=ERROR. Entegrasyon testi + build temiz.

## Sıradaki — Faz 3b (Üye alanı, lokal Postgres)

- Şema/migration: courses, lessons, events (+ seed). 0002_content.sql.
- domain: Course/Lesson/Event entity'leri + repository portları.
- application: getMemberDashboard, listCourses, getCourse use-case'leri.
- infrastructure: Postgres adapter'ları (.server.ts).
- server/: createServerFn composition (loader'lardan çağrılır).
- ui: MemberLayout (ui/shared), üye dashboard (MediaCard/EventCard), dersler list + detail.
- Geçici dev-session: mock "current user" (auth Supabase fazında gelecek).

## Komutlar

- `npm run dev | build | lint | typecheck | test | format`
- `npm run db:migrate` — lokal Postgres migration'ları uygula

## Stub'lar / açık uçlar

- `/login` placeholder; `/kisisel-program/odeme`, `/ozel-program/odeme`, `/mentorluk/satin-al`
  CheckoutStub (Stripe Faz: ödeme). Videolar poster placeholder (asset taşınmadı).
- Auth henüz yok (Supabase fazında). Member ekranları geçici dev-session ile.

## Son Oturum Notu (2026-06-10)

- Faz 0→3a tek oturumda bitti (8 commit). Lokal Postgres `refactor530` DB'sine waitlist gerçekten
  yazıyor. /ana formundan test edilebilir. Sıradaki: üye alanı (Faz 3b).
