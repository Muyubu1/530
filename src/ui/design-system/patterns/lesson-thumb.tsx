import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LessonThumbProps {
  order: number;
  title: string;
  thumbnailUrl?: string | null;
  durationMinutes?: number | null;
  active?: boolean;
  completed?: boolean;
  className?: string;
}

/**
 * A lesson thumbnail tile. Presentational — wrap in a `<Link>`/`<button>`.
 * Shared by the course-list carousel and the course-detail sidebar (DRY).
 */
export function LessonThumb({
  order,
  title,
  thumbnailUrl,
  durationMinutes,
  active,
  completed,
  className,
}: LessonThumbProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card/30 text-left transition-all",
        active ? "border-cream/60" : "border-border/40 hover:border-cream/40",
        className,
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            loading="lazy"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
              completed && "brightness-50",
            )}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[oklch(0.155_0_0)]">
            <span className="font-display text-2xl font-semibold text-cream/15">
              {String(order).padStart(2, "0")}
            </span>
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-md bg-background/80 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.15em] text-cream/80 backdrop-blur">
          {String(order).padStart(2, "0")}
        </span>
        {completed && (
          <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-cream text-background">
            <Check className="h-3 w-3" strokeWidth={2.5} />
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="line-clamp-2 font-display text-xs font-medium leading-snug tracking-[-0.005em] text-cream sm:text-sm">
          {title}
        </p>
        {durationMinutes != null && (
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">
            {durationMinutes} dk
          </p>
        )}
      </div>
    </div>
  );
}
