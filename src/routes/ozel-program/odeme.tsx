import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PLANS, formatTRY, type PlanKey } from "@/domain/pricing";
import { PaymentPage } from "@/ui/features/payment/payment-page";
import { recordPurchaseFn } from "@/server/payments";

const MAP: Record<string, { key: PlanKey; label: string }> = {
  "1ay": { key: "ozel_1ay", label: "1 Aylık Danışmanlık" },
  "2ay": { key: "ozel_2ay", label: "2 Aylık Danışmanlık" },
  "3ay": { key: "ozel_3ay", label: "3 Aylık Danışmanlık" },
};

export const Route = createFileRoute("/ozel-program/odeme")({
  validateSearch: (s: Record<string, unknown>): { plan: string } => ({
    plan: typeof s.plan === "string" ? s.plan : "1ay",
  }),
  component: OzelOdemeRoute,
});

function OzelOdemeRoute() {
  const { plan } = Route.useSearch();
  const navigate = useNavigate();
  const sel = MAP[plan] ?? MAP["1ay"];
  return (
    <PaymentPage
      planKey={sel.key}
      title="Halil Mamati · Özel Danışmanlık"
      planLabel={sel.label}
      price={formatTRY(PLANS[sel.key].amountTRY)}
      returnPath="/payment-success"
      onSuccess={async (email) => {
        await recordPurchaseFn({ data: { email } });
        navigate({ to: "/payment-success", search: { email } });
      }}
    />
  );
}
