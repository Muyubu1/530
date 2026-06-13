import { createFileRoute } from "@tanstack/react-router";
import { AdminComingSoon } from "@/ui/features/admin/coming-soon";

export const Route = createFileRoute("/admin/etkinlikler")({
  component: EtkinliklerRoute,
});

function EtkinliklerRoute() {
  return <AdminComingSoon title="Etkinlikler" />;
}
