import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { KisiselProgramPage } from "@/ui/features/programs/kisisel-program-page";

export const Route = createFileRoute("/kisisel-program/")({
  head: () => ({
    meta: [
      { title: "Kişisel Program — Halil Mamati Kişisel Danışmanlık" },
      {
        name: "description",
        content: "Halil Mamati ile bire bir kişisel danışmanlık programına katıl.",
      },
    ],
  }),
  component: KisiselRoute,
});

function KisiselRoute() {
  const navigate = useNavigate();
  return (
    <KisiselProgramPage
      onCheckout={(plan) => navigate({ to: "/kisisel-program/odeme", search: { plan } })}
    />
  );
}
