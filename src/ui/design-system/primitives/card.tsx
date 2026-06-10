import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-2xl border bg-background/70 backdrop-blur-xl", {
  variants: {
    variant: {
      default: "border-cream/15",
      subtle: "border-border/40 bg-card/30",
      elevated: "border-cream/15",
    },
  },
  defaultVariants: { variant: "default" },
});

const ELEVATED_SHADOW =
  "0 0 0 1px color-mix(in oklab, var(--cream) 10%, transparent), 0 40px 120px -20px color-mix(in oklab, var(--cream) 12%, transparent), 0 0 80px -10px color-mix(in oklab, var(--cream) 8%, transparent)";

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

/** Cinematic surface. `elevated` adds the layered glow shadow used on hero cards. */
export function Card({ variant, className, style, ...props }: CardProps) {
  return (
    <div
      className={cn(cardVariants({ variant }), className)}
      style={variant === "elevated" ? { boxShadow: ELEVATED_SHADOW, ...style } : style}
      {...props}
    />
  );
}
