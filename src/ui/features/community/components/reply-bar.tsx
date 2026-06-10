import { X } from "lucide-react";

export function ReplyBar({
  name,
  snippet,
  onCancel,
}: {
  name: string;
  snippet: string;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-3 border-t border-border/40 bg-background/80 px-4 py-2 backdrop-blur">
      <span className="h-8 w-0.5 shrink-0 rounded bg-cream/60" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-cream">{name}</p>
        <p className="truncate text-xs text-muted-foreground/70">{snippet}</p>
      </div>
      <button
        type="button"
        onClick={onCancel}
        aria-label="yanıtı iptal et"
        className="shrink-0 text-muted-foreground/60 transition-colors hover:text-cream"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
