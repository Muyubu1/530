import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { OzelProgramPage } from "@/ui/features/programs/ozel-program-page";

export const Route = createFileRoute("/ozel-program/")({
  head: () => ({
    meta: [
      { title: "Özel Program — Halil Mamati Özel Danışmanlık" },
      {
        name: "description",
        content: "Halil Mamati ile bire bir özel danışmanlık programına katıl.",
      },
    ],
  }),
  component: OzelRoute,
});

function OzelRoute() {
  const navigate = useNavigate();
  return (
    <OzelProgramPage
      onCheckout={(plan) => navigate({ to: "/ozel-program/odeme", search: { plan } })}
    />
  );
}
