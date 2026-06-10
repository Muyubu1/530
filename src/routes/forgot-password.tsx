import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordPage } from "@/ui/features/auth/forgot-password-page";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});
