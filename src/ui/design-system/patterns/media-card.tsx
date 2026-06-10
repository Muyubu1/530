import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MediaCardProps {
  thumbnail?: string | null;
  title: string;
  ctaLabel: string;
  /** Watch progress 0–100; omit to hide the bar. */
  progress?: number;
  className?: string;
}

/**
 * Thumbnail + title + play CTA, with an optional progress bar.
 * Presentational only — wrap it in a `<Link>` (the parent provides navigation
 * and the `group` hover context). Replaces the continue-watching card that was
 * duplicated verbatim across the member dashboard.
 */
export function MediaCard({ thumbnail, title, ctaLabel, progress, className }: MediaCardProps) {
  return (
    <div
      className={cn(
        "group relative z-10 flex flex-col items-stretch gap-3 overflow-hidden rounded-xl border border-border/40 bg-[oklch(0.155_0_0)] p-4 text-left shadow-[0_20px_60px_-30px_rgba(0,0,0,1)] transition-all hover:border-cream/50 sm:flex-row sm:gap-5",
        className,
      )}
    >
      <div className="relative h-28 w-full flex-shrink-0 overflow-hidden rounded-lg bg-black sm:w-48">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            loading="lazy"
            className="absolute inset-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-card/40" />
        )}
        {typeof progress === "number" && (
          <div className="absolute inset-x-0 bottom-1 mx-1 h-1 rounded bg-cream/10">
            <div
              className="h-full rounded bg-cream/80"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start gap-3 sm:justify-between">
        <p className="line-clamp-2 font-display text-xs font-medium leading-snug tracking-[-0.005em] text-cream sm:line-clamp-1 sm:text-base">
          {title}
        </p>
        <span className="flex flex-shrink-0 items-center justify-center gap-2 self-end rounded-md bg-cream px-5 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-background transition-colors group-hover:bg-cream/90">
          <Play className="h-3 w-3 fill-background" />
          {ctaLabel}
        </span>
      </div>
    </div>
  );
}
