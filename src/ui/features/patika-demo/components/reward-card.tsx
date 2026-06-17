import { ArrowRight, Gift, Lock } from "lucide-react";
import { Eyebrow } from "@/ui/design-system";

/** Glowing gift box on a lit podium. */
function RewardArt() {
  return (
    <div className="relative mx-auto flex h-40 w-full max-w-[220px] items-center justify-center md:h-48">
      <span
        aria-hidden
        className="absolute h-28 w-28 rounded-full bg-cream/10 blur-3xl md:h-32 md:w-32"
      />
      <span
        aria-hidden
        className="absolute bottom-5 h-3 w-36 rounded-[50%] bg-cream/25 blur-md"
        style={{ boxShadow: "0 0 30px rgba(234,242,246,0.35)" }}
      />
      <Gift
        aria-hidden
        className="relative h-24 w-24 text-cream md:h-28 md:w-28"
        strokeWidth={1.25}
        style={{ filter: "drop-shadow(0 0 16px rgba(234,242,246,0.55))" }}
      />
    </div>
  );
}

/** 28th-day reward teaser. Mobile-first: cube on top, copy below → 2-col on md. */
export function RewardCard({ unlocked, onOpen }: { unlocked: boolean; onOpen?: () => void }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-cream/10 bg-gradient-to-br from-[#10151b] to-[#0b0f14] p-6 md:p-10">
      <div className="grid items-center gap-6 md:grid-cols-[0.75fr_1.25fr] md:gap-10">
        <RewardArt />
        <div>
          <Eyebrow size="md" tone="cream">
            28. gün ödülü
          </Eyebrow>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground/80 md:text-xl">
            Bu yolculuğu tamamladığında seni özel bir ödül bekliyor.
          </p>
          <button
            type="button"
            onClick={unlocked ? onOpen : undefined}
            disabled={!unlocked}
            className="group mt-6 inline-flex items-center gap-3 rounded-full border border-cream/35 px-6 py-3.5 font-mono text-xs uppercase tracking-[0.26em] text-cream transition-all enabled:hover:border-cream enabled:hover:bg-cream enabled:hover:text-background disabled:opacity-60"
          >
            Detayları Gör
            {unlocked ? (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
