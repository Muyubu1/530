import { createFileRoute } from "@tanstack/react-router";
import { CheckoutStub } from "@/ui/features/programs/checkout-stub";

export const Route = createFileRoute("/kisisel-program/odeme")({
  validateSearch: (s: Record<string, unknown>): { plan: string } => ({
    plan: typeof s.plan === "string" ? s.plan : "1ay",
  }),
  component: KisiselOdemeRoute,
});

function KisiselOdemeRoute() {
  const { plan } = Route.useSearch();
  return <CheckoutStub program="Kişisel Danışmanlık" plan={plan} />;
}
