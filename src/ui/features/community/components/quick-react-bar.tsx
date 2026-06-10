import { Plus } from "lucide-react";
import { QUICK_EMOJI } from "../lib/emoji-data";

export function QuickReactBar({
  onPick,
  onMore,
}: {
  onPick: (emoji: string) => void;
  onMore: () => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-border/60 bg-background/95 px-2 py-1.5 shadow-lg backdrop-blur">
      {QUICK_EMOJI.map((e) => (
        <button
          key={e}
          type="button"
          onClick={() => onPick(e)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-lg transition-transform hover:scale-125"
        >
          {e}
        </button>
      ))}
      <button
        type="button"
        onClick={onMore}
        aria-label="daha fazla emoji"
        className="flex h-8 w-8 items-center justify-center rounded-full text-cream/60 hover:bg-cream/10"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
