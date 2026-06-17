import { createFileRoute } from "@tanstack/react-router";
import { listCoursesFn } from "@/server/courses";
import { listUpcomingEventsFn } from "@/server/events";
import { useAuth } from "@/ui/shared/auth/auth-context";
import { MemberDashboard } from "@/ui/features/member/member-dashboard";

// Classic member dashboard (greeting + continue + events). No longer the landing
// screen — the journey (/uye/patika) is; reachable from the menu.
export const Route = createFileRoute("/uye/panel")({
  loader: async () => {
    const [courses, events] = await Promise.all([listCoursesFn(), listUpcomingEventsFn()]);
    return { courses, events };
  },
  component: PanelRoute,
});

function PanelRoute() {
  const { courses, events } = Route.useLoaderData();
  const { user } = useAuth();
  if (!user) return null; // gated by the /uye layout; render nothing while resolving
  return <MemberDashboard user={user} courses={courses} events={events} />;
}
