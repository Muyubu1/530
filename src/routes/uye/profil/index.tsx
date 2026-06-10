import { createFileRoute } from "@tanstack/react-router";
import { ProfilPage } from "@/ui/features/member/profil-page";

export const Route = createFileRoute("/uye/profil/")({
  component: ProfilPage,
});
