import { useEffect, useState } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { Button } from "@/ui/design-system";
import { createPaymentIntentFn } from "@/server/payments";
import { getStripe } from "./stripe-client";

export function StripePaymentForm({
  planKey,
  email,
  returnPath,
  onSuccess,
}: {
  planKey: string;
  email: string;
  returnPath: string;
  onSuccess: () => void;
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const stripePromise = getStripe();

  useEffect(() => {
    let active = true;
    createPaymentIntentFn({ data: { planKey, email } })
      .then((r) => active && setClientSecret(r.clientSecret))
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, [planKey, email]);

  if (!stripePromise) {
    return (
      <p className="rounded-lg border border-border/40 bg-card/30 p-4 text-center text-sm text-muted-foreground/70">
        Ödeme yapılandırması eksik (Stripe anahtarları henüz eklenmedi).
      </p>
    );
  }
  if (failed) {
    return (
      <p className="text-center text-sm text-destructive">Ödeme başlatılamadı. Tekrar dene.</p>
    );
  }
  if (!clientSecret) {
    return <p className="text-center text-sm text-muted-foreground/70">Ödeme hazırlanıyor…</p>;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: { theme: "night", variables: { colorPrimary: "#f5f5f5" } },
      }}
    >
      <InnerForm returnPath={returnPath} onSuccess={onSuccess} />
    </Elements>
  );
}

function InnerForm({ returnPath, onSuccess }: { returnPath: string; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}${returnPath}` },
      redirect: "if_required",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message ?? "Ödeme başarısız.");
      return;
    }
    if (paymentIntent?.status === "succeeded") onSuccess();
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <PaymentElement />
      <Button
        type="submit"
        variant="cream"
        size="lg"
        className="w-full"
        disabled={loading || !stripe}
      >
        {loading ? "işleniyor…" : "ödemeyi tamamla"}
      </Button>
    </form>
  );
}
