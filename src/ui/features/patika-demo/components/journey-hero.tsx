import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/ui/design-system";

/** Decorative glowing light-trail (desktop only) — the "path" climbing to the goal. */
function LightTrail() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-[60%] md:block"
      viewBox="0 0 600 460"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="patika-trail" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#eaf2f6" stopOpacity="0" />
          <stop offset="0.55" stopColor="#eaf2f6" stopOpacity="0.85" />
          <stop offset="1" stopColor="#bcd2ff" stopOpacity="0.25" />
        </linearGradient>
        <filter id="patika-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <path
        d="M-40 470 C 220 430 330 250 360 150 C 380 80 470 60 660 20"
        stroke="url(#patika-trail)"
        strokeWidth="3"
        filter="url(#patika-glow)"
        opacity="0.7"
      />
      <path
        d="M-40 470 C 220 430 330 250 360 150 C 380 80 470 60 660 20"
        stroke="#eaf2f6"
        strokeWidth="1.2"
        opacity="0.55"
      />
      <circle cx="360" cy="150" r="22" fill="#eaf2f6" opacity="0.18" filter="url(#patika-glow)" />
      <circle cx="360" cy="150" r="5.5" fill="#fff" />
    </svg>
  );
}

/** The journey hero: day, title, focus CTA + the progress card. Mobile-first (stacked → 2-col). */
export function JourneyHero({
  currentDay,
  total,
  completedDays,
  pct,
  streak,
  finished,
  onFocusToday,
}: {
  currentDay: number;
  total: number;
  completedDays: number;
  pct: number;
  streak: number;
  finished: boolean;
  onFocusToday: () => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-cream/10 bg-gradient-to-b from-[#10151b] to-[#0b0f14] px-6 py-9 md:px-10 md:py-14">
      <LightTrail />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full bg-cream/10 blur-3xl"
      />

      <div className="relative grid gap-8 md:grid-cols-[1.25fr_0.9fr] md:items-center">
        <div>
          <Eyebrow size="md" tone="cream">
            gün {String(Math.min(currentDay, total)).padStart(2, "0")}
          </Eyebrow>
          <h1 className="mt-4 font-display text-4xl font-semibold uppercase leading-[0.95] tracking-tight text-cream sm:text-5xl md:text-6xl">
            Kendini
            <br />
            <span className="text-cream/45">İnşa Et.</span>
          </h1>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-muted-foreground/75 md:text-lg">
            Disiplin, her gün küçük zaferlerle gerçekleşir.
          </p>
          <button
            type="button"
            onClick={onFocusToday}
            disabled={finished}
            className="group mt-7 inline-flex items-center gap-3 rounded-full border border-cream/35 px-6 py-3.5 font-mono text-xs uppercase tracking-[0.28em] text-cream transition-all hover:border-cream hover:bg-cream hover:text-background disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-cream"
          >
            {finished ? "patika tamamlandı" : "bugüne odaklan"}
            {!finished && (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            )}
          </button>
        </div>

        <div className="rounded-2xl border border-cream/15 bg-card/40 p-6 backdrop-blur md:p-7">
          <Eyebrow size="sm">ilerlemen</Eyebrow>
          <p className="mt-3 font-display text-5xl text-cream md:text-6xl">%{pct}</p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground/60">
            {completedDays} / {total} gün
          </p>
          <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-cream/10">
            <div
              className="h-full rounded-full bg-cream transition-[width] duration-700"
              style={{ width: `${pct}%`, boxShadow: "0 0 14px rgba(234,242,246,0.7)" }}
            />
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-cream/10 pt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60">
            <span>seri · {streak}</span>
            <span>hedef · {total}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
