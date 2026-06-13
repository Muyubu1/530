import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboardPage } from "@/ui/features/admin/dashboard-page";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});
