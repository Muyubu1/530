import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Atmospheric wrapper. Replaces the inline film-grain / vignette / scanline /
 * glow `<div>` soup that was copy-pasted into every section.
 * Content is rendered above the decorations on its own stacking layer.
 */
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  grain?: boolean | "animated";
  vignette?: boolean;
  scanlines?: boolean;
  /** Soft radial glow bleeding from the top edge. */
  glow?: boolean;
  as?: "section" | "div" | "header" | "footer";
  contentClassName?: string;
}

export function Section({
  grain,
  vignette,
  scanlines,
  glow,
  as = "section",
  className,
  contentClassName,
  children,
  ...props
}: SectionProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "relative isolate overflow-hidden",
        grain === "animated" && "film-grain film-grain-animated",
        grain === true && "film-grain",
        vignette && "vignette",
        scanlines && "scanlines",
        className,
      )}
      {...props}
    >
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[60%]"
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 50% 0%, oklch(0.9 0 0 / 0.12), transparent 65%)",
          }}
        />
      )}
      <div className={cn("relative z-10", contentClassName)}>{children}</div>
    </Tag>
  );
}

/** Centered max-width layout band. Pairs with <Section> (ambience vs. width). */
const containerVariants = cva("mx-auto w-full px-6 md:px-10", {
  variants: {
    size: {
      sm: "max-w-2xl",
      md: "max-w-3xl",
      lg: "max-w-5xl",
      xl: "max-w-7xl",
    },
  },
  defaultVariants: { size: "lg" },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof containerVariants> {}

export function Container({ size, className, ...props }: ContainerProps) {
  return <div className={cn(containerVariants({ size }), className)} {...props} />;
}
