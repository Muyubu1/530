import { Award, Lock } from "lucide-react";
import { Eyebrow } from "@/ui/design-system";
import { BADGES } from "../lib/mock-journey";
import { cn } from "@/lib/utils";

export function BadgeShelf({ earned }: { earned: string[] }) {
  return (
    <div>
      <Eyebrow size="sm">başarımlar</Eyebrow>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {BADGES.map((b) => {
          const has = earned.includes(b.id);
          return (
            <div key={b.id} className="flex flex-col items-center gap-2 text-center">
              <span
                className={cn(
                  "relative flex h-14 w-14 items-center justify-center rounded-full border-2",
                  has
                    ? "border-cream bg-cream/10 text-cream"
                    : "border-border/50 text-muted-foreground/45",
                )}
              >
                {has && (
                  <span
                    aria-hidden
                    className="animate-ember-pulse absolute -inset-1 rounded-full bg-cream/15 blur"
                  />
                )}
                {has ? (
                  <Award className="relative h-7 w-7" strokeWidth={1.5} />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
              </span>
              <span
                className={cn(
                  "font-mono text-[8px] uppercase tracking-[0.15em]",
                  has ? "text-cream/80" : "text-muted-foreground/45",
                )}
              >
                {b.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
