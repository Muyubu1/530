import { createFileRoute } from "@tanstack/react-router";
import { AdminComingSoon } from "@/ui/features/admin/coming-soon";

export const Route = createFileRoute("/admin/guncellemeler")({
  component: GuncellemelerRoute,
});

function GuncellemelerRoute() {
  return <AdminComingSoon title="Güncellemeler" />;
}
