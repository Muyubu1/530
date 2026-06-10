import { createFileRoute } from "@tanstack/react-router";
import { MemberLayout } from "@/ui/shared/member-layout";
import { getCurrentUser } from "@/server/session";

// Layout route for the whole member area. MemberLayout renders <Outlet/>.
// Auth gate is deferred (Supabase phase); /uye is currently open.
export const Route = createFileRoute("/uye")({
  component: UyeLayout,
});

function UyeLayout() {
  return <MemberLayout user={getCurrentUser()} />;
}
