import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { invalid?: boolean }
>(({ className, type, invalid, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    aria-invalid={invalid || undefined}
    className={cn(
      "flex h-11 w-full rounded-md border bg-transparent px-4 py-2 text-sm text-cream transition-colors placeholder:text-muted-foreground/40 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      invalid
        ? "border-destructive/70 focus:border-destructive"
        : "border-border/60 focus:border-cream",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
