import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { emojiOnlyCount } from "../lib/is-emoji-only";

export function ChatBubble({
  mine,
  showName,
  name,
  nameColor,
  content,
  time,
  allowEmojiOnly,
  children,
}: {
  mine: boolean;
  showName: boolean;
  name: string;
  nameColor: string;
  content: string | null;
  time: string;
  /** When true, a 1–3 emoji message renders large with no bubble. */
  allowEmojiOnly?: boolean;
  /** Media / reply-quote rendered above the text. */
  children?: ReactNode;
}) {
  const eo = allowEmojiOnly && content ? emojiOnlyCount(content) : 0;
  if (eo > 0) {
    return (
      <div className={cn("flex flex-col", mine ? "items-end" : "items-start")}>
        <span className="leading-none" style={{ fontSize: eo === 1 ? "52px" : "40px" }}>
          {content}
        </span>
        <span className="mt-1 font-mono text-[9px] text-muted-foreground/50">{time}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative max-w-[78%] rounded-2xl px-3 py-2 text-[15px] leading-[1.45]",
        mine ? "bg-cream/15 text-cream" : "border border-border/40 bg-card/60 text-cream/90",
      )}
    >
      {showName && !mine && (
        <p className="mb-0.5 text-xs font-semibold" style={{ color: nameColor }}>
          {name}
        </p>
      )}
      {children}
      <div className="flex items-end gap-2">
        {content && <span className="whitespace-pre-wrap break-words">{content}</span>}
        <span className="ml-auto shrink-0 translate-y-0.5 font-mono text-[9px] text-muted-foreground/50">
          {time}
        </span>
      </div>
    </div>
  );
}
