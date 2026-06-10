import { createFileRoute } from "@tanstack/react-router";
import { listCoursesFn } from "@/server/courses";
import { listUpcomingEventsFn } from "@/server/events";
import { useAuth } from "@/ui/shared/auth/auth-context";
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
  const { user } = useAuth();
  if (!user) return null; // gated by the /uye layout; render nothing while resolving
  return <MemberDashboard user={user} courses={courses} events={events} />;
}
