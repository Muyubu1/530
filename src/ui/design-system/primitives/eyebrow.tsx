import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * The small mono uppercase label that sits above headings everywhere.
 * Replaces the dozens of inline `font-mono text-[10px] uppercase tracking-…` spans.
 */
const eyebrowVariants = cva("font-eyebrow text-muted-foreground", {
  variants: {
    size: {
      sm: "text-[9px] tracking-[0.3em]",
      md: "text-[10px] tracking-[0.4em]",
      lg: "text-[11px] tracking-[0.5em]",
    },
    tone: {
      muted: "text-muted-foreground",
      cream: "text-cream/70",
      ink: "text-black/70",
    },
  },
  defaultVariants: { size: "md", tone: "muted" },
});

export interface EyebrowProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof eyebrowVariants> {
  /** Hairline rule placement relative to the label. */
  rule?: "none" | "top" | "left";
}

export function Eyebrow({
  children,
  className,
  size,
  tone,
  rule = "none",
  ...props
}: EyebrowProps) {
  if (rule === "none") {
    return (
      <span className={cn(eyebrowVariants({ size, tone }), className)} {...props}>
        {children}
      </span>
    );
  }
  const isTop = rule === "top";
  return (
    <div
      className={cn(
        "flex",
        isTop ? "flex-col items-center gap-4" : "items-center gap-3",
        className,
      )}
      {...props}
    >
      <span className={cn("bg-cream/25", isTop ? "h-px w-14" : "h-px w-10")} aria-hidden />
      <span className={cn(eyebrowVariants({ size, tone }))}>{children}</span>
    </div>
  );
}
