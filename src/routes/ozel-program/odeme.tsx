import { createFileRoute } from "@tanstack/react-router";
import { CheckoutStub } from "@/ui/features/programs/checkout-stub";

export const Route = createFileRoute("/ozel-program/odeme")({
  validateSearch: (s: Record<string, unknown>): { plan: string } => ({
    plan: typeof s.plan === "string" ? s.plan : "1ay",
  }),
  component: OzelOdemeRoute,
});

function OzelOdemeRoute() {
  const { plan } = Route.useSearch();
  return <CheckoutStub program="Özel Danışmanlık" plan={plan} />;
}
