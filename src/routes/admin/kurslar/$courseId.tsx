import { createFileRoute } from "@tanstack/react-router";
import { AdminCourseDetailPage } from "@/ui/features/admin/course-detail-page";

export const Route = createFileRoute("/admin/kurslar/$courseId")({
  component: CourseDetailRoute,
});

function CourseDetailRoute() {
  const { courseId } = Route.useParams();
  return <AdminCourseDetailPage courseId={courseId} />;
}
