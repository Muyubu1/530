import { useEffect, useRef } from "react";
import { Check, Gift } from "lucide-react";
import { DAYS } from "../lib/mock-journey";
import { cn } from "@/lib/utils";

type State = "done" | "today" | "locked";
type Item = { kind: "day"; day: number; last: boolean } | { kind: "gap"; lit: boolean };

const TOTAL = DAYS.length;

/**
 * Condensed, glowing 28-day timeline (mobile-first). Shows the first steps, a
 * window around today, and the finale (28) — the hidden stretches collapse to "···".
 * Always ends on day 28 (the reward). Today auto-centers; the reached track glows.
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

  // Visible anchors: opening steps + the window around today + the finale.
  const set = new Set<number>([1, 2, 3, TOTAL]);
  for (const d of [currentDay - 1, currentDay, currentDay + 1]) {
    if (d >= 1 && d <= TOTAL) set.add(d);
  }
  const days = [...set].sort((a, b) => a - b);

  const items: Item[] = [];
  days.forEach((day, i) => {
    items.push({ kind: "day", day, last: day === TOTAL });
    const next = days[i + 1];
    if (next !== undefined && next - day > 1) items.push({ kind: "gap", lit: next <= currentDay });
  });

  const theme = DAYS[Math.min(currentDay, TOTAL) - 1]?.theme;

  return (
    <div>
      <div
        className="flex items-start gap-1 overflow-x-auto pb-2 [scrollbar-width:none] sm:gap-2 [&::-webkit-scrollbar]:hidden"
        role="list"
      >
        {items.map((it, i) => {
          if (it.kind === "gap") {
            return (
              <div key={`gap-${i}`} className="flex w-9 shrink-0 flex-col items-center sm:w-12">
                <span aria-hidden className="mb-3 text-[11px] opacity-0">
                  ·
                </span>
                <div className="relative flex h-12 w-full items-center justify-center">
                  <span
                    className={cn(
                      "absolute left-0 right-0 top-1/2 h-px -translate-y-1/2",
                      it.lit ? "bg-cream/80" : "bg-cream/12",
                    )}
                  />
                  <span className="relative z-10 bg-background px-1.5 font-mono text-base leading-none text-muted-foreground/40">
                    ···
                  </span>
                </div>
              </div>
            );
          }

          const state: State =
            it.day < currentDay ? "done" : it.day === currentDay ? "today" : "locked";
          const reachable = it.day <= currentDay;
          const first = i === 0;
          const last = i === items.length - 1;
          const leftLit = !first && it.day <= currentDay;
          const rightLit = !last && it.day < currentDay;

          return (
            <div
              key={it.day}
              ref={state === "today" ? todayRef : undefined}
              role="listitem"
              className="flex flex-1 shrink-0 basis-12 flex-col items-center"
            >
              <span
                className={cn(
                  "mb-3 font-mono text-[11px] tracking-[0.18em]",
                  state === "today" ? "text-cream" : "text-muted-foreground/45",
                )}
              >
                {String(it.day).padStart(2, "0")}
              </span>
              <div className="relative flex h-12 w-full items-center justify-center">
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
                  day={it.day}
                  state={state}
                  isReward={it.last}
                  onClick={reachable ? () => onPickDay(it.day) : undefined}
                />
              </div>
            </div>
          );
        })}
      </div>

      {theme && (
        <p className="mt-5 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground/55">
          {currentDay > TOTAL ? "patika tamamlandı" : `bugün · ${theme}`}
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
