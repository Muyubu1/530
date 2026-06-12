import { useEffect, type CSSProperties } from "react";
import { Check } from "lucide-react";
import { Eyebrow } from "@/ui/design-system";

const PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const dist = 72 + (i % 3) * 26;
  return { tx: Math.cos(angle) * dist, ty: Math.sin(angle) * dist, delay: (i % 4) * 40 };
});

export function DayComplete({
  day,
  streak,
  points,
  onDone,
}: {
  day: number;
  streak: number;
  points: number;
  onDone: () => void;
}) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 1600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      onClick={onDone}
      className="fixed inset-0 z-[140] flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center">
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-cream bg-cream/10 text-cream [animation:celebrate-pop_0.5s_ease-out_both]">
          <Check className="h-9 w-9" strokeWidth={2.5} />
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-cream"
              style={
                {
                  "--tx": `${p.tx.toFixed(1)}px`,
                  "--ty": `${p.ty.toFixed(1)}px`,
                  animation: `particle-burst 1s ease-out ${p.delay}ms both`,
                } as CSSProperties
              }
            />
          ))}
        </span>

        <Eyebrow size="sm" tone="cream" className="mt-6 justify-center">
          gün tamamlandı
        </Eyebrow>
        <p className="mt-2 font-display text-2xl text-cream">{day}. Gün</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
          seri {streak} · +{points} puan
        </p>
      </div>
    </div>
  );
}
