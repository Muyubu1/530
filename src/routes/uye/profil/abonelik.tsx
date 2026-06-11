import { createFileRoute } from "@tanstack/react-router";
import { SubscriptionPage } from "@/ui/features/member/subscription-page";

export const Route = createFileRoute("/uye/profil/abonelik")({
  component: SubscriptionPage,
});
