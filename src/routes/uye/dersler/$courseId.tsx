import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCourseFn } from "@/server/courses";
import { CourseDetailPage } from "@/ui/features/member/course-detail-page";

export const Route = createFileRoute("/uye/dersler/$courseId")({
  validateSearch: (s: Record<string, unknown>): { lesson?: string; t?: number } => ({
    lesson: typeof s.lesson === "string" ? s.lesson : undefined,
    t: typeof s.t === "number" ? s.t : undefined,
  }),
  loader: async ({ params }) => {
    const course = await getCourseFn({ data: params.courseId });
    if (!course) throw notFound();
    return course;
  },
  component: CourseDetailRoute,
});

function CourseDetailRoute() {
  const course = Route.useLoaderData();
  const { lesson } = Route.useSearch();
  return <CourseDetailPage course={course} activeLessonId={lesson} />;
}
