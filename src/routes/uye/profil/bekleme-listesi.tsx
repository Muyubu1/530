import { createFileRoute } from "@tanstack/react-router";
import { WaitlistAdminPage } from "@/ui/features/member/waitlist-admin-page";

export const Route = createFileRoute("/uye/profil/bekleme-listesi")({
  component: WaitlistAdminPage,
});
