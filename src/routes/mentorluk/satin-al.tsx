import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PLANS, formatTRY } from "@/domain/pricing";
import { PaymentPage } from "@/ui/features/payment/payment-page";

export const Route = createFileRoute("/mentorluk/satin-al")({
  component: MentorlukSatinAlRoute,
});

function MentorlukSatinAlRoute() {
  const navigate = useNavigate();
  return (
    <PaymentPage
      planKey="mentorluk_1saat"
      title="Halil'den 1-1 Mentörlük"
      planLabel="Mentörlük — 1 Saat"
      price={formatTRY(PLANS.mentorluk_1saat.amountTRY)}
      returnPath="/mentorluk/tesekkurler"
      onSuccess={(email) => navigate({ to: "/mentorluk/tesekkurler", search: { email } })}
    />
  );
}
