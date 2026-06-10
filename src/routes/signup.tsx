import { createFileRoute } from "@tanstack/react-router";
import { SignupPage } from "@/ui/features/auth/signup-page";

export const Route = createFileRoute("/signup")({
  validateSearch: (s: Record<string, unknown>): { email: string } => ({
    email: typeof s.email === "string" ? s.email : "",
  }),
  component: SignupRoute,
});

function SignupRoute() {
  const { email } = Route.useSearch();
  return <SignupPage email={email} />;
}
