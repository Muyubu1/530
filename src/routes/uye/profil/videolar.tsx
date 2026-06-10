import { createFileRoute } from "@tanstack/react-router";
import { SavedVideosPage } from "@/ui/features/member/saved-videos-page";

export const Route = createFileRoute("/uye/profil/videolar")({
  component: SavedVideosPage,
});
