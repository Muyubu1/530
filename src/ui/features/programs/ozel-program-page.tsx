import { useState } from "react";
import {
  ProgramScene,
  Reveal,
  Eyebrow,
  Heading,
  GradientText,
  Card,
  FeatureList,
  FeatureItem,
  Button,
} from "@/ui/design-system";
import { SiteHeader } from "@/ui/shared/site-header";
import { PLANS, formatTRY } from "@/domain/pricing";

export type OzelPlanId = "1ay" | "2ay" | "3ay";

const FEATURES = [
  "Halil Mamati ile bire bir özel oturumlar",
  "Kişiye özel yol haritası ve takip",
  "Sınırsız mesajlaşma desteği",
  "Özel materyaller ve kaynaklar",
];

const OPTIONS: { id: OzelPlanId; label: string; amountTRY: number; sub: string }[] = [
  {
    id: "1ay",
    label: "1 Aylık Danışmanlık",
    amountTRY: PLANS.ozel_1ay.amountTRY,
    sub: "4 görüşme / 4 saat",
  },
  {
    id: "2ay",
    label: "2 Aylık Danışmanlık",
    amountTRY: PLANS.ozel_2ay.amountTRY,
    sub: "8 görüşme / 8 saat",
  },
  {
    id: "3ay",
    label: "3 Aylık Danışmanlık",
    amountTRY: PLANS.ozel_3ay.amountTRY,
    sub: "12 görüşme / 12 saat",
  },
];

/** Özel danışmanlık satış sayfası: tek kart + plan seçici (radio). */
export function OzelProgramPage({ onCheckout }: { onCheckout: (plan: OzelPlanId) => void }) {
  const [plan, setPlan] = useState<OzelPlanId>("1ay");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <ProgramScene contentClassName="max-w-2xl">
        <Reveal variant="fade-down">
          <Eyebrow className="block text-center">katıl</Eyebrow>
        </Reveal>

        <Reveal variant="blur-in" delay={150} duration={1300}>
          <Heading as="h1" size="lg" className="mx-auto mt-6 max-w-2xl text-center">
            Seni Aramızda <GradientText>Görmek için Sabırsızlanıyoruz.</GradientText>
          </Heading>
        </Reveal>

        <Reveal variant="fade-up" delay={350}>
          <p className="mx-auto mt-4 max-w-md text-center text-xs leading-relaxed text-muted-foreground/70 lg:text-sm">
            Hayatını sıra dışı bir hale getirmenin ilk adımı.
          </p>
        </Reveal>

        <Reveal variant="scale-in" delay={500} duration={1100}>
          <Card variant="elevated" className="mx-auto mt-10 max-w-md overflow-hidden sm:mt-16">
            <div className="flex flex-col items-center border-b border-cream/10 px-4 pb-4 pt-6 text-center sm:px-8 sm:pb-8 sm:pt-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground/70">
                Program
              </p>
              <h2 className="mt-4 font-display text-xl font-medium tracking-tight text-cream md:text-2xl">
                Halil Mamati
              </h2>
              <p className="mt-1 font-display text-sm font-light uppercase tracking-[0.18em] text-cream/70">
                Özel Danışmanlık
              </p>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground/80">
                Bire bir, kişiye özel bir yolculuk.
              </p>
            </div>

            <div className="px-4 py-4 sm:px-8 sm:py-8">
              <FeatureList>
                {FEATURES.map((f) => (
                  <FeatureItem key={f} className="text-[13px]">
                    {f}
                  </FeatureItem>
                ))}
              </FeatureList>
            </div>

            <div className="border-t border-cream/10 px-4 py-4 sm:px-8 sm:py-8">
              <p className="text-center font-mono text-[9px] uppercase tracking-[0.32em] text-muted-foreground/60">
                Ödeme Planı
              </p>
              <div className="mt-3 grid gap-2">
                {OPTIONS.map((opt) => {
                  const active = plan === opt.id;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setPlan(opt.id)}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-all ${
                        active
                          ? "border-cream/60 bg-cream/[0.06]"
                          : "border-cream/10 bg-cream/[0.02] hover:border-cream/25"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                            active ? "border-cream bg-cream" : "border-cream/30"
                          }`}
                        >
                          {active && <span className="h-1.5 w-1.5 rounded-full bg-background" />}
                        </span>
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cream">
                            {opt.label}
                          </p>
                          <p className="mt-1 text-[10px] text-muted-foreground/70">{opt.sub}</p>
                        </div>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-2xl font-medium tracking-tight text-cream">
                          {formatTRY(opt.amountTRY)}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                          TL
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-cream/10 px-4 pb-6 pt-4 sm:px-8 sm:pb-10 sm:pt-8">
              <Button className="w-full" size="lg" onClick={() => onCheckout(plan)}>
                Ödemeye Geç
              </Button>
              <p className="pt-3 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-cream/80">
                Güvenli ödeme · 7 gün koşulsuz iade
              </p>
            </div>
          </Card>
        </Reveal>
      </ProgramScene>
    </div>
  );
}
