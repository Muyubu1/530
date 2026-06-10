import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * One button system for the whole app.
 * - App/form buttons: `default`, `secondary`, `outline`, `ghost`, `link`.
 * - Cinematic CTAs (mono, uppercase, wide tracking): `cream`, `cta`, `pill`.
 * Use `asChild` to render a `<Link>`/`<a>` while keeping the styling.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        ghost:
          "border border-cream/40 bg-transparent text-cream hover:border-cream hover:bg-cream/10",
        link: "text-primary underline-offset-4 hover:underline",
        cream: "bg-cream font-mono uppercase tracking-[0.25em] text-background hover:bg-cream/90",
        cta: "border border-cream/40 bg-transparent font-mono uppercase tracking-[0.4em] text-cream/90 transition-all duration-500 hover:border-cream hover:bg-cream hover:text-background",
        pill: "rounded-full border border-cream/30 bg-transparent font-mono uppercase tracking-[0.3em] text-cream/80 hover:border-cream hover:text-cream",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-10 px-5 py-2",
        lg: "h-12 px-8 text-sm",
        xl: "px-16 py-6 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { buttonVariants };
