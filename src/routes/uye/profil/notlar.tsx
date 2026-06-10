import { createFileRoute } from "@tanstack/react-router";
import { NotesPage } from "@/ui/features/member/notes-page";

export const Route = createFileRoute("/uye/profil/notlar")({
  component: NotesPage,
});
