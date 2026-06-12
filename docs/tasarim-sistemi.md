# 5.30 — Tasarım Sistemi Referansı

Bu dosya, yeni bir ekran (özellikle **Patika**) tasarlarken birebir uyman için mevcut görsel dili,
bileşenleri, araçları ve kalıpları belgeler. **Kural:** değerleri elle yazma — hep token'ı/bileşeni kullan.
Tek kaynak: `src/ui/design-system/tokens.css` + `src/ui/design-system/` bileşenleri.

---

## 1. Felsefe — "Dijital Sinematik Mono"
- **Sıcak sinema siyahı + saf monokrom.** Renk yok; her şey siyah–gri–krem. Vurgu rengiyle değil, **kontrast, tipografi ve boşlukla** kurulur.
- Doku: ince **film grain**, **scanlines**, yumuşak **vignette**, nokta ızgarası — hepsi çok düşük opaklıkta, dekoratif.
- Ses tonu (microcopy): **küçük harf Türkçe**, kısa, iddialı. Üst etiketler (eyebrow) **BÜYÜK HARF mono + geniş harf aralığı**. Tire (—) kullanılır.
- His: disiplin, ciddiyet, "bir standart". 5.30 = şafak/disiplin teması.

---

## 2. Renk (tokens — `oklch`, saf mono)
Tailwind v4 `@theme` ile `--color-*` olarak açılır; sınıf adıyla kullan (`bg-background`, `text-cream`…).

| Token (sınıf) | Değer | Kullanım |
|---|---|---|
| `background` | `oklch(0.08 0 0)` ~ siyah | sayfa zemini |
| `foreground` | `oklch(0.96 0 0)` | ana metin |
| `card` | `oklch(0.12 0 0)` | kart zemini |
| `muted` / `muted-foreground` | `0.18` / `0.66` | ikincil zemin / soluk metin |
| `border` | `oklch(0.22 0 0)` | ince çizgiler |
| `input` | `oklch(0.18 0 0)` | form zemini |
| `primary` | `oklch(0.96 0 0)` (krem) | dolu butonlar |
| `cream` | `oklch(0.98 0 0)` | en parlak vurgu (metin/çizgi) |
| `gold/ember/copper` | mono griye eşlendi | eski isimler korundu; pratikte gri |
| `destructive` | `oklch(0.6 0.2 25)` kırmızı | hata/sil |

**Tek istisna — durum renkleri:** Mono dışında yalnız **anlamsal durumlar** için Tailwind renkleri kullanılır, o da seyrek:
- başarı/aktif → `emerald` (ör. online noktası `bg-emerald-400`)
- uyarı/dikkat → `amber` (ör. fiyat "uyuşmuyor", test modu şeridi `bg-amber-500`)
- tehlike → `red`/`destructive`
Patika'da "tamamlandı/eksik/seri" durumları için bu üçlüyü (emerald/amber/red) **rozet** olarak kullan; gerisi mono kalsın.

Sık kullanılan opaklık tonlamaları: `text-cream/80`, `border-cream/30`, `bg-card/40`, `text-muted-foreground/60`.

---

## 3. Tipografi
| Rol | Değişken / sınıf | Font |
|---|---|---|
| Başlık (display) | `font-display` | **Syne** |
| Gövde/UI | (varsayılan) `font-sans` | **Plus Jakarta Sans** |
| Eyebrow / mono | `font-mono`, `font-eyebrow` | **JetBrains Mono** |

Kurallar:
- **Eyebrow** (üst etiket): `font-mono`, `uppercase`, geniş `tracking` (0.3em–0.5em), küçük punto (9–11px), soluk renk. İmza öğesi — her sayfa başında.
- **Başlık**: `Heading` bileşeni (Syne, `text-cream`, sıkı tracking).
- Sayısal/etiket/rozet metinleri genelde `font-mono` + küçük punto + uppercase + tracking.

---

## 4. Primitives (bileşen API'leri) — `@/ui/design-system`
> Hepsi buradan import edilir: `import { Button, Card, Eyebrow, Heading } from "@/ui/design-system";`

### Button — `variant` × `size` (cva), `asChild` destekler
- `variant`: `default` (dolu krem-ish) · `secondary` · `outline` · `ghost` (krem kenarlık) · `link` · **`cream`** (dolu krem, mono uppercase — ana CTA) · **`cta`** (ince kenarlık, çok geniş tracking, hover'da dolar) · **`pill`** (yuvarlak hap).
- `size`: `sm` · `md` · `lg` · `xl` · `icon`.
- Link'e sarmak için: `<Button asChild variant="cream"><Link to="…">…</Link></Button>`.

### Card — `variant`
- base: `rounded-2xl border bg-background/70 backdrop-blur-xl`.
- `variant`: `default` (krem/15 kenarlık) · **`subtle`** (`border-border/40 bg-card/30` — üye alanı kartları) · `elevated`.

### Eyebrow — `size` × `tone` + `rule`
- `size`: `sm`(9px/0.3em) · `md`(10px/0.4em) · `lg`(11px/0.5em).
- `tone`: `muted` · `cream` · `ink`.
- `rule`: `none` · `top` (üstte ortalı hairline çizgi) · `left` (solda çizgi).
- Örnek: `<Eyebrow size="sm">benim odam · ayarlar</Eyebrow>`.

### Heading / GradientText — `as` × `size`
- `as`: `h1`…`h6`. `size`: `sm` · `md` · `lg` · `xl`. (Syne, `text-cream`.)
- `<Heading as="h1" size="xl">Başlık</Heading>`.

### Section / Container (public/pazarlama düzeni)
- `Section`: ambians bayrakları → `grain`, `vignette`, `scanlines`, `glow` (boolean); `as`, `contentClassName`.
- `Container`: `size` `sm`(max-w-2xl) · `md`(3xl) · `lg`(5xl) · `xl`(7xl).

### Diğer primitives
`Input`, `Label`, `Checkbox`, `Divider`, `Wordmark` (logo), `Reveal` (scroll-in animasyon), `FeatureList`/`FeatureItem`, `GlowHalo`,
`Dialog*` (modal — Radix), `DropdownMenu*` (Radix). İkonlar: **lucide-react**. Toast: **sonner** (`toast.success/error`).

---

## 5. Patterns (primitive'lerden bestelenmiş) — `@/ui/design-system`
- **ProgramScene** — sinematik tam sayfa sahne (program/ödeme sayfalarının çatısı); `contentClassName` ile içerik genişliği.
- **PageHero** — sayfa başlığı bloğu (eyebrow + heading + alt metin).
- **PricingCard** — fiyat kartı. **MediaCard / LessonThumb** — içerik/ders kartı. **EventCard** — etkinlik.
- **CinematicVideoFrame** — sinematik video çerçevesi (play, progress, `topRightSlot`, `onTimeUpdate`, `startAt`).
- **Backgrounds** (dekoratif, `relative` kapsayıcı içine): `DotGrid`, `GridLines`, `ConcentricRings`, `VerticalLines`, `HorizonLine`, `StaticDust`, `MeasureMarks`, `HeroParticles`, `ScrollGlow`.

---

## 6. Utility sınıfları & animasyonlar (tokens.css)
- **Sayfa girişi:** `animate-rise` (üye sayfaları bununla açılır). `Reveal` bileşeni = scroll-in.
- **Doku:** `film-grain`, `film-grain-animated`, `scanlines`, `vignette`, `glow-ember`.
- **Dekoratif halkalar:** `ring-trace`, `ring-spin-slow`, `ring-spin-rev`, `ring-sweep`, `ring-cross`.
- **Hero:** `twinkle-star`, `hero-dust`, `hero-spark`, `hero-halo`, `hero-ray(-a/-b)`, `border-beam-wrap`.
- **Diğer keyframe:** `chat-in` (mesaj girişi), `barcode-shine`, `gold-badge-pulse`, `vsl-pause-hint`, `glow-breathe`.
- Metin gradyanı: `text-gradient-ember` / `bg-gradient-ember`. Gölge: `shadow-glow`. Elmas çizgi: `rule-diamond`.

> Yeni animasyon gerekiyorsa keyframe'i **tokens.css'e** ekle, bileşende `animate-[ad_süre_easing]` ile çağır (Patika'da `chat-in`'i eklediğimiz gibi).

---

## 7. Mimari yerleşim & araçlar
- **Katmanlar (boundaries = ERROR ile zorunlu):** `domain → application → infrastructure → server → ui`. UI asla infrastructure'a dokunmaz.
- **UI yerleşimi:**
  - `src/ui/design-system/` — paylaşılan görsel dil (yukarıdakiler). Feature'lar buraya stil **eklemez**, buradan **tüketir**.
  - `src/ui/shared/` — uygulama çapında paylaşılan kabuk/parçalar (`member-layout`, `auth`, `site-header`, `chat` gateway…).
  - `src/ui/features/<feature>/` — ekranlar + o ekrana özel bileşenler/hook'lar (`components/`, `lib/`, `use-*.ts`).
- **Araçlar:** Tailwind v4 (sınıf), **cva** (varyant), `cn` (`@/lib/utils`, clsx + tailwind-merge), lucide-react (ikon), sonner (toast), TanStack Router (`Link`, `createFileRoute`), Radix (Dialog/Dropdown/Checkbox).
- **Stil yazımı:** Yeni bir varyant tekrar ediyorsa cva'ya ekle; tek seferlikse `cn("…", koşul && "…")`. Token sınıflarını kullan, ham `oklch`/hex yazma.

---

## 8. Sayfa kompozisyon kalıpları (kopyala-uyarla)

### A) Üye alanı ekranı (Patika ekranları bunu izlemeli)
Üye sayfaları `MemberLayout` içinde `<Outlet/>` ile render olur (üst nav + mobil alt nav + hesap menüsü hazır). İçerik kalıbı:

```tsx
export function PatikaBugunPage() {
  return (
    <div className="animate-rise mx-auto max-w-2xl">
      <Eyebrow size="sm">patika · bugün</Eyebrow>
      <Heading as="h1" size="xl" className="mt-6">
        14. Gün
      </Heading>

      {/* görev kartları */}
      <div className="mt-10 space-y-3">
        <Card variant="subtle" className="flex items-center justify-between p-5">
          {/* ikon + başlık + durum rozeti */}
        </Card>
      </div>
    </div>
  );
}
```
- Başlık üstü her zaman **Eyebrow** (mono, uppercase, `· ` ile kırılım).
- Kartlar **`variant="subtle"`**, `p-5`/`p-6`, `rounded-2xl`, hover'da `group-hover:border-cream/40`.
- Liste/sırada `space-y-3` veya `grid gap-3 sm:grid-cols-2` (profil hub'ındaki gibi).
- Sağ uçta `ChevronRight` (gidilebilir) ya da durum rozeti.

### B) Liste kartı (profil "oda" kartı deseni — `profil-page.tsx`)
```tsx
<Link to="…" className="group">
  <Card variant="subtle" className="flex items-center justify-between p-5 transition-colors group-hover:border-cream/40">
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-cream/70" strokeWidth={1.5} />
      <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-cream">etiket</span>
    </div>
    <ChevronRight className="h-4 w-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
  </Card>
</Link>
```

### C) Durum rozeti (Patika için: tamamlandı / bugün / kilitli)
```tsx
<span className="rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em]
  border-emerald-500/40 bg-emerald-500/10 text-emerald-300">tamamlandı</span>
```
(amber = bugün/bekliyor, muted/border = kilitli, emerald = tamam — fiyat-kontrol/chat'teki rozet diliyle aynı.)

---

## 9. Patika ekranları için hazır eşleştirme (uyum rehberi)
Senin tarif edeceğin 28 günlük rota için **yeni görsel dil icat etmeyeceğiz** — mevcut parçalarla:

| Patika öğesi | Kullanılacak mevcut kalıp |
|---|---|
| Sayfa başlığı | `Eyebrow size="sm"` + `Heading as="h1" size="xl"` + `animate-rise` |
| "Bugünün görevi" / görev satırı | `Card variant="subtle"` + lucide ikon + başlık + **durum rozeti** |
| İlerleme çubuğu / yol | ince `bg-cream` dolgu (chat waveform/progress mantığı) ya da nokta-dizisi (mono) |
| Gün/aşama düğümleri (patika haritası) | dairesel düğümler: tamam=krem dolu, bugün=krem kenarlık+pulse, kilitli=`border-border/40` |
| Rozet/başarım | dairesel madalya + `font-mono` isim; kazanınca `gold-badge-pulse`/`animate-[chat-in]` açılış |
| Seri (streak) | küçük sayaç + ikon (lucide `Flame`), mono punto |
| Mentör notu/onay | `Card variant="subtle"` alıntı bloğu (chat `reply-quote` dili) |
| Modal (görev detay/onay) | `Dialog*` primitive |
| Boş/kilitli durum | ortalı `Lock` ikon + soluk metin (waitlist/fiyat-kontrol "yetkin yok" deseni) |

Mikro-kopya: küçük harf, kısa. Eyebrow'lar uppercase mono. Renk yok — durum rozetleri hariç.

---

## 10. Özet kurallar (checklist)
1. Zemin siyah, metin krem; **renk yok** (durum rozetleri hariç emerald/amber/red).
2. Her sayfa: `animate-rise` + `Eyebrow` + `Heading`.
3. Kart = `Card variant="subtle"`, `rounded-2xl`, hover'da krem kenarlık.
4. Etiket/sayı/rozet = `font-mono` uppercase + geniş tracking + küçük punto.
5. Buton = `Button` (`cream` ana CTA, `ghost`/`pill` ikincil).
6. İkon = lucide, `strokeWidth={1.5}`. Toast = sonner.
7. Token sınıflarını kullan; ham renk/spacing yazma. Yeni varyant → cva; yeni animasyon → tokens.css.
8. Ekran `ui/features/patika/`'ya; ortak parça design-system'den tüketilir, oraya stil eklenmez.
