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
    <button
      type="button"
      onClick={onClick}
      disabled={state === "locked"}
      aria-label={`Gün ${day}`}
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-full border-2 font-mono text-xs transition-transform",
        state === "done" && "border-cream bg-cream text-background",
        state === "today" &&
          "animate-ember-pulse border-cream bg-cream/10 text-cream hover:scale-105",
        state === "locked" && "border-border/40 text-muted-foreground/40",
      )}
    >
      {state === "done" ? <Check className="h-5 w-5" strokeWidth={2.5} /> : day}
    </button>
  );
}
