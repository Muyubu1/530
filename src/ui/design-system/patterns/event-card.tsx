import { Card } from "../primitives/card";
import { cn } from "@/lib/utils";

export interface EventCardProps {
  title: string;
  /** Detail lines, e.g. ["Tarih: 10 Haziran 2026 · 14:00", "Konum: İstanbul"]. */
  details: string[];
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/** Upcoming-event tile with a corner action. */
export function EventCard({ title, details, actionLabel, onAction, className }: EventCardProps) {
  return (
    <Card variant="subtle" className={cn("relative overflow-hidden p-5 sm:p-6", className)}>
      <p className="pr-20 font-display text-sm font-medium tracking-[-0.005em] text-cream sm:text-base">
        {title}
      </p>
      <div className="mt-3 space-y-0.5 text-[11px] leading-relaxed text-muted-foreground/70 sm:text-xs">
        {details.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="absolute bottom-3 right-3 rounded-md border border-cream/40 bg-transparent px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-cream transition-colors hover:border-cream hover:bg-cream/10"
        >
          {actionLabel}
        </button>
      )}
    </Card>
  );
}
