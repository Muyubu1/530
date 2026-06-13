import { useState } from "react";
import { ProgramScene, Eyebrow, Heading, Card, Button } from "@/ui/design-system";
import { SiteHeader } from "@/ui/shared/site-header";
import { ValidatedField } from "@/ui/shared/forms/validated-field";
import * as validate from "@/lib/validation";
import { PaymentTestModeBanner } from "@/ui/shared/stripe/payment-test-mode-banner";
import { StripePaymentForm } from "@/ui/shared/stripe/stripe-payment-form";

export function PaymentPage({
  planKey,
  title,
  planLabel,
  price,
  returnPath,
  onSuccess,
}: {
  planKey: string;
  title: string;
  planLabel: string;
  price: string;
  returnPath: string;
  onSuccess: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const emailErr = validate.email(email);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PaymentTestModeBanner />
      <SiteHeader />
      <ProgramScene contentClassName="max-w-md">
        <Eyebrow rule="top" tone="cream" className="justify-center">
          ödeme
        </Eyebrow>
        <Heading as="h1" size="lg" className="mt-6 text-center">
          {title}
        </Heading>

        <Card variant="elevated" className="mx-auto mt-8 max-w-md p-6">
          <div className="flex items-center justify-between border-b border-cream/10 pb-4">
            <span className="text-sm text-cream/80">{planLabel}</span>
            <span className="font-display text-2xl font-medium text-cream">
              {price} <span className="text-xs text-muted-foreground/60">TL</span>
            </span>
          </div>

          {!confirmed ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!emailErr) setConfirmed(true);
              }}
              className="mt-5 space-y-3"
            >
              <ValidatedField
                type="email"
                autoComplete="email"
                placeholder="E-posta adresin"
                value={email}
                onChange={setEmail}
                error={emailErr}
              />
              <Button
                type="submit"
                variant="cream"
                size="lg"
                className="w-full"
                disabled={!!emailErr}
              >
                devam et
              </Button>
              <p className="pt-1 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
                Güvenli ödeme · 7 gün koşulsuz iade
              </p>
            </form>
          ) : (
            <div className="mt-5">
              <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                {email}
              </p>
              <StripePaymentForm
                planKey={planKey}
                email={email}
                returnPath={returnPath}
                onSuccess={() => onSuccess(email)}
              />
            </div>
          )}
        </Card>
      </ProgramScene>
    </div>
  );
}
