import { Pin, X } from "lucide-react";
import type { ChatMessage } from "@/domain/chat";

export function PinnedBar({
  message,
  onScrollTo,
  onClose,
}: {
  message: ChatMessage;
  onScrollTo: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border/40 bg-background/85 px-4 py-2 backdrop-blur">
      <Pin className="h-3.5 w-3.5 shrink-0 text-cream/60" />
      <button type="button" onClick={onScrollTo} className="min-w-0 flex-1 text-left">
        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground/50">
          sabitlenmiş
        </p>
        <p className="truncate text-xs text-cream/80">{message.content ?? "📎 medya"}</p>
      </button>
      <button
        type="button"
        onClick={onClose}
        aria-label="sabitlemeyi gizle"
        className="shrink-0 text-muted-foreground/50 transition-colors hover:text-cream"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
