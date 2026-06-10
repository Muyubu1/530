import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/ui/design-system";
import { ThankYouPage } from "@/ui/features/payment/thank-you-page";
import { recordPurchaseFn } from "@/server/payments";

export const Route = createFileRoute("/payment-success")({
  validateSearch: (s: Record<string, unknown>): { email?: string } => ({
    email: typeof s.email === "string" ? s.email : undefined,
  }),
  component: PaymentSuccessRoute,
});

function PaymentSuccessRoute() {
  const { email } = Route.useSearch();

  // Idempotent safety net (covers redirect-based payment methods).
  useEffect(() => {
    if (email) recordPurchaseFn({ data: { email } }).catch(() => {});
  }, [email]);

  return (
    <ThankYouPage
      eyebrow="ödeme alındı"
      title="Hoş geldin."
      message="Ödemen başarıyla alındı. Üye alanına erişmek için hesabını oluştur."
    >
      <Button asChild variant="cream" size="lg" className="w-full">
        <Link to="/signup" search={{ email: email ?? "" }}>
          hesabını oluştur
        </Link>
      </Button>
    </ThankYouPage>
  );
}
