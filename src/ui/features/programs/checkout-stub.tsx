import { Link } from "@tanstack/react-router";
import { Eyebrow, Heading } from "@/ui/design-system";

/** Placeholder for the Stripe checkout — real payment flow lands in Faz 3. */
export function CheckoutStub({ program, plan }: { program: string; plan?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-foreground">
      <Eyebrow>ödeme · yakında</Eyebrow>
      <Heading as="h1" size="lg" className="mt-5">
        {program}
      </Heading>
      {plan && (
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          seçilen plan: {plan}
        </p>
      )}
      <p className="mt-5 max-w-sm text-sm text-muted-foreground">
        Stripe ödeme akışı Faz 3'te (altyapı) gelecek.
      </p>
      <Link
        to="/ana"
        className="mt-8 rounded-full border border-cream/30 px-5 py-2 font-eyebrow text-[10px] text-cream/80 transition-colors hover:border-cream hover:text-cream"
      >
        ← landing
      </Link>
    </div>
  );
}
