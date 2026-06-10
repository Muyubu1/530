import { useMemo } from "react";
import type { Reaction } from "@/domain/chat";
import { groupReactions } from "../lib/group-reactions";
import { cn } from "@/lib/utils";

export function ReactionPills({
  reactions,
  meId,
  mine,
  onToggle,
}: {
  reactions: Reaction[];
  meId?: string;
  mine: boolean;
  onToggle: (emoji: string) => void;
}) {
  const groups = useMemo(() => groupReactions(reactions, meId), [reactions, meId]);
  if (groups.length === 0) return null;

  return (
    <div className={cn("mt-1 flex flex-wrap gap-1", mine && "justify-end")}>
      {groups.map((g) => (
        <button
          key={g.emoji}
          type="button"
          onClick={() => onToggle(g.emoji)}
          className={cn(
            "flex items-center gap-1 rounded-full border px-2 py-0.5 text-[12px] transition-colors",
            g.mineId
              ? "border-cream/50 bg-cream/15 text-cream"
              : "border-border/40 bg-card/40 text-cream/70 hover:border-cream/30",
          )}
        >
          <span>{g.emoji}</span>
          <span className="font-mono text-[9px]">{g.count}</span>
        </button>
      ))}
    </div>
  );
}
