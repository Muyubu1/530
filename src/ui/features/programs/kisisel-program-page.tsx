import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  ProgramScene,
  Reveal,
  Heading,
  GradientText,
  PricingCard,
  Button,
  FeatureList,
  FeatureItem,
} from "@/ui/design-system";
import { SiteHeader } from "@/ui/shared/site-header";
import { PLANS, formatTRY } from "@/domain/pricing";

export type KisiselPlanId = "1ay" | "3ay";

const features = (sessions: number, hours: number) => [
  `Halil Mamati ile bire bir kişisel oturumlar (${sessions} Görüşme + ${hours} Saat)`,
  "Kişiye özel yol haritası ve takip",
  "Sınırsız mesajlaşma desteği",
  "Özel materyaller ve kaynaklar",
];

/** Kişisel danışmanlık satış sayfası: ana plan kartı + 3 aylık upsell. */
export function KisiselProgramPage({ onCheckout }: { onCheckout: (plan: KisiselPlanId) => void }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <ProgramScene>
        <Reveal variant="fade-down">
          <p className="text-center font-sans text-sm tracking-wide text-gold/90 lg:text-base">
            Kendini ileriye taşımak isteyenler ve zor zamanlarına çözüm arayanlar için:
          </p>
        </Reveal>

        <Reveal variant="blur-in" delay={150} duration={1300}>
          <Heading as="h1" size="lg" className="mx-auto mt-6 text-center">
            Halil Mamati'den <GradientText>1'e 1 Özel Mentörlük</GradientText>
          </Heading>
        </Reveal>

        <Reveal variant="scale-in" delay={500} duration={1100}>
          <div className="mt-12 sm:mt-16">
            <PricingCard
              eyebrow="Program"
              title="Halil Mamati"
              subtitle="KİŞİSEL DANIŞMANLIK"
              description="Bire bir, kişiye özel bir yolculuk."
              features={features(4, 4)}
              planLabel="1 Aylık Danışmanlık"
              planMeta="4 görüşme + 4 saat"
              price={formatTRY(PLANS.kisisel_1ay.amountTRY)}
              ctaLabel="Ödemeye Geç"
              onCta={() => onCheckout("1ay")}
              elevated
            />
          </div>
        </Reveal>

        <div className="mx-auto mt-8 max-w-md">
          <UpsellPlan
            label="3 Aylık Danışmanlık"
            price={formatTRY(PLANS.kisisel_3ay.amountTRY)}
            meta="12 görüşme + 12 saat"
            bonus="Tam dönüşüm için yeterli süre — kalıcı sonuçlar ve sürdürülebilir alışkanlıklar."
            features={features(12, 12)}
            onCheckout={() => onCheckout("3ay")}
          />
        </div>
      </ProgramScene>
    </div>
  );
}

/** Page-specific expandable upsell card with a pulsing "Tercih Edilen" badge. */
function UpsellPlan({
  label,
  price,
  meta,
  bonus,
  features: items,
  onCheckout,
}: {
  label: string;
  price: string;
  meta: string;
  bonus: string;
  features: string[];
  onCheckout: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative mt-6 overflow-visible rounded-2xl border border-cream/15 bg-background/60 backdrop-blur-xl transition-all"
      style={{
        boxShadow: open
          ? "0 0 0 1px color-mix(in oklab, var(--cream) 18%, transparent), 0 30px 80px -20px color-mix(in oklab, var(--gold) 25%, transparent)"
          : "0 0 0 1px color-mix(in oklab, var(--cream) 6%, transparent)",
      }}
    >
      <span
        className="pointer-events-none absolute left-4 top-3 z-10 rounded-full border border-gold/60 bg-background/90 px-2.5 py-1 font-sans text-[10px] tracking-wide text-gold backdrop-blur"
        style={{ animation: "gold-badge-pulse 2.2s ease-in-out infinite" }}
      >
        Tercih Edilen
      </span>
      <div className="overflow-hidden rounded-2xl">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 px-4 py-5 pt-12 text-left transition-colors hover:bg-cream/[0.03] sm:px-6"
        >
          <div className="min-w-0 flex-1">
            <p className="font-sans text-base font-medium tracking-tight text-cream">{label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground/70">{meta}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-baseline gap-1">
              <span className="font-sans text-xl font-medium tracking-tight text-cream">
                {price}
              </span>
              <span className="font-sans text-xs tracking-wide text-muted-foreground/60">TL</span>
            </div>
            <ChevronDown
              className={`h-5 w-5 text-cream/60 transition-transform ${open ? "rotate-180" : ""}`}
              strokeWidth={1.75}
            />
          </div>
        </button>

        {open && (
          <div className="border-t border-cream/10 px-4 pb-5 pt-4 sm:px-6">
            <p className="text-sm leading-relaxed text-cream/85">{bonus}</p>
            <FeatureList className="mt-4 space-y-2">
              {items.map((f) => (
                <FeatureItem key={f} className="text-sm">
                  {f}
                </FeatureItem>
              ))}
            </FeatureList>
            <Button size="lg" className="mt-5 w-full" onClick={onCheckout}>
              Ödemeye Geç
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
