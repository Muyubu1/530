import { createFileRoute } from "@tanstack/react-router";
import { listCoursesFn } from "@/server/courses";
import { listUpcomingEventsFn } from "@/server/events";
import { getCurrentUser } from "@/server/session";
import { MemberDashboard } from "@/ui/features/member/member-dashboard";

export const Route = createFileRoute("/uye/")({
  loader: async () => {
    const [courses, events] = await Promise.all([listCoursesFn(), listUpcomingEventsFn()]);
    return { courses, events };
  },
  component: DashboardRoute,
});

function DashboardRoute() {
  const { courses, events } = Route.useLoaderData();
  return <MemberDashboard user={getCurrentUser()} courses={courses} events={events} />;
}
