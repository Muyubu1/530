import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** A bullet list of selling points. Used across program / pricing surfaces. */
export function FeatureList({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={cn("space-y-2.5", className)} {...props}>
      {children}
    </ul>
  );
}

export function FeatureItem({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li
      className={cn("flex items-start gap-3 text-base leading-relaxed text-cream/90", className)}
      {...props}
    >
      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" strokeWidth={1.75} />
      <span>{children}</span>
    </li>
  );
}
