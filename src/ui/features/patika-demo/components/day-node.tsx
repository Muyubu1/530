import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type NodeState = "done" | "today" | "locked";

export function DayNode({
  day,
  state,
  onClick,
}: {
  day: number;
  state: NodeState;
  onClick?: () => void;
}) {
  return (
    <div className="relative">
      {state === "today" && (
        <span
          aria-hidden
          className="animate-ember-pulse absolute -inset-2 rounded-full bg-cream/20 blur-md"
        />
      )}
      <button
        type="button"
        onClick={onClick}
        disabled={state === "locked"}
        aria-label={`Gün ${day}`}
        className={cn(
          "relative flex h-14 w-14 items-center justify-center rounded-full border-2 font-mono text-base font-semibold transition-transform",
          state === "done" && "border-cream bg-cream text-background",
          state === "today" && "border-cream bg-cream/10 text-cream hover:scale-110",
          state === "locked" && "border-border/60 text-muted-foreground/55",
        )}
      >
        {state === "done" ? <Check className="h-6 w-6" strokeWidth={3} /> : day}
      </button>
    </div>
  );
}
