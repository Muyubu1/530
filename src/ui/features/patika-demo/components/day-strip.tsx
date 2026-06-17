import { useEffect, useRef } from "react";
import { Check, Gift } from "lucide-react";
import { DAYS } from "../lib/mock-journey";
import { cn } from "@/lib/utils";

type State = "done" | "today" | "locked";

/**
 * Horizontal, scrollable 28-day timeline (mobile-first). The reached portion of
 * the track glows; today is a pulsing orb; day 28 is the reward. Today auto-centers.
 */
export function DayStrip({
  currentDay,
  onPickDay,
}: {
  currentDay: number;
  onPickDay: (day: number) => void;
}) {
  const todayRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    todayRef.current?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [currentDay]);

  const theme = DAYS[Math.min(currentDay, DAYS.length) - 1]?.theme;

  return (
    <div>
      <div
        className="flex overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
      >
        {DAYS.map((d, i) => {
          const state: State =
            d.day < currentDay ? "done" : d.day === currentDay ? "today" : "locked";
          const isLast = i === DAYS.length - 1;
          const reachable = d.day <= currentDay;
          const leftLit = i > 0 && d.day <= currentDay;
          const rightLit = !isLast && d.day < currentDay;

          return (
            <div
              key={d.day}
              ref={state === "today" ? todayRef : undefined}
              role="listitem"
              className="flex w-[58px] shrink-0 flex-col items-center sm:w-16"
            >
              <span
                className={cn(
                  "mb-3 font-mono text-[11px] tracking-[0.18em]",
                  state === "today" ? "text-cream" : "text-muted-foreground/45",
                )}
              >
                {String(d.day).padStart(2, "0")}
              </span>
              <div className="relative flex h-12 w-full items-center justify-center">
                {/* track halves (under the node) */}
                <span
                  className={cn(
                    "absolute left-0 top-1/2 h-px w-1/2 -translate-y-1/2",
                    leftLit ? "bg-cream/80" : "bg-cream/12",
                  )}
                  style={leftLit ? { boxShadow: "0 0 6px rgba(234,242,246,0.5)" } : undefined}
                />
                <span
                  className={cn(
                    "absolute right-0 top-1/2 h-px w-1/2 -translate-y-1/2",
                    rightLit ? "bg-cream/80" : "bg-cream/12",
                  )}
                  style={rightLit ? { boxShadow: "0 0 6px rgba(234,242,246,0.5)" } : undefined}
                />

                <DayNodeMark
                  day={d.day}
                  state={state}
                  isReward={isLast}
                  onClick={reachable ? () => onPickDay(d.day) : undefined}
                />
              </div>
            </div>
          );
        })}
      </div>

      {theme && (
        <p className="mt-5 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground/55">
          {currentDay > DAYS.length ? "patika tamamlandı" : `bugün · ${theme}`}
        </p>
      )}
    </div>
  );
}

function DayNodeMark({
  day,
  state,
  isReward,
  onClick,
}: {
  day: number;
  state: State;
  isReward: boolean;
  onClick?: () => void;
}) {
  const base =
    "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-background transition-transform";

  if (state === "today") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Gün ${day} · bugün`}
        className={cn(base, "border-cream hover:scale-105")}
      >
        <span
          aria-hidden
          className="animate-ember-pulse absolute -inset-2 rounded-full bg-cream/25 blur-md"
        />
        <span
          className="relative h-3.5 w-3.5 rounded-full bg-cream"
          style={{ boxShadow: "0 0 14px rgba(234,242,246,0.95)" }}
        />
      </button>
    );
  }

  if (state === "done") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Gün ${day} · tamamlandı`}
        className={cn(base, "border-cream bg-cream text-background hover:scale-105")}
      >
        {isReward ? (
          <Gift className="h-5 w-5" strokeWidth={2} />
        ) : (
          <Check className="h-5 w-5" strokeWidth={3} />
        )}
      </button>
    );
  }

  // locked
  return (
    <button
      type="button"
      disabled
      aria-label={`Gün ${day} · kilitli`}
      className={cn(
        base,
        "cursor-default border-border/60 font-mono text-sm font-semibold text-muted-foreground/55",
      )}
    >
      {isReward ? <Gift className="h-5 w-5" strokeWidth={1.75} /> : day}
    </button>
  );
}
