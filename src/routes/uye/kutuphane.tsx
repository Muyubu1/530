import { createFileRoute } from "@tanstack/react-router";
import { LibraryPage } from "@/ui/features/member/library-page";

export const Route = createFileRoute("/uye/kutuphane")({
  component: LibraryPage,
});
