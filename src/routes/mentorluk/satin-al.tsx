import { createFileRoute } from "@tanstack/react-router";
import { CheckoutStub } from "@/ui/features/programs/checkout-stub";

export const Route = createFileRoute("/mentorluk/satin-al")({
  component: () => <CheckoutStub program="Mentörlük — 1 Saat" />,
});
