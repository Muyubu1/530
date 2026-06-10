import { createFileRoute } from "@tanstack/react-router";
import { ChatPage } from "@/ui/features/community/chat-page";

export const Route = createFileRoute("/uye/topluluk")({
  component: ChatPage,
});
