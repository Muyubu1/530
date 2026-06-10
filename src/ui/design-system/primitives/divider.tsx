import { cn } from "@/lib/utils";

type DividerVariant = "diamond" | "line" | "dot";

/** Editorial separators. `diamond` uses the .rule-diamond token utility. */
export function Divider({
  variant = "diamond",
  className,
}: {
  variant?: DividerVariant;
  className?: string;
}) {
  if (variant === "line") {
    return <span aria-hidden className={cn("block h-px w-full bg-cream/15", className)} />;
  }
  if (variant === "dot") {
    return (
      <div
        aria-hidden
        className={cn("flex items-center justify-center gap-3 text-cream/30", className)}
      >
        <span className="h-px w-12 bg-cream/15" />
        <span className="h-1 w-1 rounded-full bg-cream/30" />
        <span className="h-px w-12 bg-cream/15" />
      </div>
    );
  }
  return (
    <div aria-hidden className={cn("rule-diamond", className)}>
      <span className="inline-block h-1 w-1 rotate-45 bg-gold/60" />
    </div>
  );
}
