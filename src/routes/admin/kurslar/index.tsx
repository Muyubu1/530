import { createFileRoute } from "@tanstack/react-router";
import { AdminCoursesPage } from "@/ui/features/admin/courses-page";

export const Route = createFileRoute("/admin/kurslar/")({
  component: AdminCoursesPage,
});
