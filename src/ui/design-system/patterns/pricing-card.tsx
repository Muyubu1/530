import { Card } from "../primitives/card";
import { Button } from "../primitives/button";
import { FeatureList, FeatureItem } from "../primitives/feature-list";
import { cn } from "@/lib/utils";

export interface PricingCardProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  features: string[];
  planLabel: string;
  planMeta?: string;
  price: string;
  currency?: string;
  ctaLabel: string;
  onCta?: () => void;
  /** Pulsing badge in the top-left, e.g. "Tercih Edilen". */
  badge?: string;
  elevated?: boolean;
  className?: string;
}

/** The program/plan purchase card: header · features · price · CTA. */
export function PricingCard({
  eyebrow,
  title,
  subtitle,
  description,
  features,
  planLabel,
  planMeta,
  price,
  currency = "TL",
  ctaLabel,
  onCta,
  badge,
  elevated = false,
  className,
}: PricingCardProps) {
  return (
    <Card
      variant={elevated ? "elevated" : "default"}
      className={cn("relative mx-auto max-w-md overflow-hidden", className)}
    >
      {badge && (
        <span
          className="pointer-events-none absolute left-4 top-3 z-10 rounded-full border border-gold/60 bg-background/90 px-2.5 py-1 font-sans text-[10px] tracking-wide text-gold backdrop-blur"
          style={{ animation: "gold-badge-pulse 2.2s ease-in-out infinite" }}
        >
          {badge}
        </span>
      )}

      <div className="flex flex-col items-center border-b border-cream/10 px-4 pb-4 pt-6 text-center sm:px-8 sm:pb-8 sm:pt-10">
        {eyebrow && (
          <p className="font-sans text-xs tracking-wide text-muted-foreground/70">{eyebrow}</p>
        )}
        <h2 className="mt-4 font-sans text-2xl font-medium leading-tight tracking-tight text-cream md:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 font-sans text-base font-light tracking-[0.18em] text-cream/70">
            {subtitle}
          </p>
        )}
        {description && (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground/80">{description}</p>
        )}
      </div>

      <div className="px-4 py-4 sm:px-8 sm:py-8">
        <FeatureList>
          {features.map((f) => (
            <FeatureItem key={f}>{f}</FeatureItem>
          ))}
        </FeatureList>
      </div>

      <div className="border-t border-cream/10 px-4 py-4 sm:px-8 sm:py-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-sans text-xs tracking-wide text-cream">{planLabel}</p>
            {planMeta && <p className="mt-1 text-xs text-muted-foreground/70">{planMeta}</p>}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-sans text-3xl font-medium tracking-tight text-cream">
              {price}
            </span>
            <span className="font-sans text-xs tracking-wide text-muted-foreground/60">
              {currency}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10 px-4 pb-6 pt-4 sm:px-8 sm:pb-10 sm:pt-8">
        <Button type="button" className="w-full" size="lg" onClick={onCta}>
          {ctaLabel}
        </Button>
      </div>
    </Card>
  );
}
