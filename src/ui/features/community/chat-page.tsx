import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useChat } from "./use-chat";
import { MessageList } from "./components/message-list";
import { Composer } from "./components/composer";

export function ChatPage() {
  const { me, messages, loaded, memberCount, send, remove } = useChat();

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <header
        className="flex items-center justify-between gap-3 border-b border-border/40 bg-background/80 px-4 py-3 backdrop-blur"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}
      >
        <Link
          to="/uye"
          aria-label="üye alanına dön"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-cream transition-colors hover:border-cream"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="text-center">
          <p className="font-display text-sm font-medium tracking-tight text-cream">530 Club</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">
            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 align-middle" />
            {memberCount} üye
          </p>
        </div>
        <span className="h-9 w-9" />
      </header>

      {loaded && messages.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-muted-foreground/60">İlk mesajı sen yaz 👋</p>
        </div>
      ) : (
        <MessageList messages={messages} meId={me?.id} onDelete={remove} />
      )}

      <Composer onSend={(text) => send({ content: text })} />
    </div>
  );
}
