import { cn } from "@/lib/utils";
import { EMOJI_GRID } from "../lib/emoji-data";

export function EmojiPicker({
  onPick,
  className,
}: {
  onPick: (emoji: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid max-h-56 w-72 grid-cols-8 gap-1 overflow-y-auto rounded-2xl border border-border/60 bg-background/95 p-2 shadow-lg backdrop-blur [scrollbar-width:thin]",
        className,
      )}
    >
      {EMOJI_GRID.map((e, i) => (
        <button
          key={`${e}-${i}`}
          type="button"
          onClick={() => onPick(e)}
          className="flex h-8 w-8 items-center justify-center rounded text-lg transition-colors hover:bg-cream/10"
        >
          {e}
        </button>
      ))}
    </div>
  );
}
