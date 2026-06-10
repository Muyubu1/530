import { createFileRoute } from "@tanstack/react-router";
import { listCoursesFn } from "@/server/courses";
import { CoursesPage } from "@/ui/features/member/courses-page";

export const Route = createFileRoute("/uye/dersler/")({
  loader: () => listCoursesFn(),
  component: CoursesRoute,
});

function CoursesRoute() {
  const courses = Route.useLoaderData();
  return <CoursesPage courses={courses} />;
}
