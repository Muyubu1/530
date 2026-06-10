import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/ui/features/member/settings-page";

export const Route = createFileRoute("/uye/profil/ayarlar")({
  component: SettingsPage,
});
