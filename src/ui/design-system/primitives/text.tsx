import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** Cinematic display heading. Sizes track the design language scale. */
const headingVariants = cva("font-display text-cream", {
  variants: {
    size: {
      sm: "text-lg font-medium tracking-[-0.005em]",
      md: "text-xl font-medium tracking-[-0.005em] md:text-2xl",
      lg: "text-2xl font-medium tracking-tight md:text-3xl",
      xl: "text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl",
    },
  },
  defaultVariants: { size: "lg" },
});

type HeadingTag = "h1" | "h2" | "h3" | "h4";

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  as?: HeadingTag;
}

export function Heading({ as = "h2", size, className, children, ...props }: HeadingProps) {
  const Tag = as;
  return (
    <Tag className={cn(headingVariants({ size }), className)} {...props}>
      {children}
    </Tag>
  );
}

/** Inline gradient-ember accent — used inside headings for the highlighted phrase. */
export function GradientText({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("text-gradient-ember", className)} {...props}>
      {children}
    </span>
  );
}
