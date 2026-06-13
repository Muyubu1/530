import { createFileRoute } from "@tanstack/react-router";
import { AdminComingSoon } from "@/ui/features/admin/coming-soon";

export const Route = createFileRoute("/admin/kurslar")({
  component: KurslarRoute,
});

function KurslarRoute() {
  return <AdminComingSoon title="Kurslar" />;
}
