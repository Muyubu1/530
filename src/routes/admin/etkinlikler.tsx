import { createFileRoute } from "@tanstack/react-router";
import { AdminEventsPage } from "@/ui/features/admin/events-page";

export const Route = createFileRoute("/admin/etkinlikler")({
  component: AdminEventsPage,
});
