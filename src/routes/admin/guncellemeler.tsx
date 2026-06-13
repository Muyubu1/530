import { createFileRoute } from "@tanstack/react-router";
import { AdminUpdatesPage } from "@/ui/features/admin/updates-page";

export const Route = createFileRoute("/admin/guncellemeler")({
  component: AdminUpdatesPage,
});
