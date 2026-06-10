import { useRef } from "react";
import { MoreHorizontal } from "lucide-react";
import type { ChatMessage, Reaction } from "@/domain/chat";
import { cn } from "@/lib/utils";
import { userColor } from "../lib/user-color";
import { ChatAvatar } from "./chat-avatar";
import { ChatBubble } from "./chat-bubble";
import { ReactionPills } from "./reaction-pills";
import { ReplyQuote } from "./reply-quote";

export function MessageRow({
  message,
  mine,
  groupStart,
  meId,
  reactions,
  highlighted,
  onToggleReaction,
  onOpenMenu,
  onScrollToReply,
}: {
  message: ChatMessage;
  mine: boolean;
  groupStart: boolean;
  meId?: string;
  reactions: Reaction[];
  highlighted: boolean;
  onToggleReaction: (emoji: string) => void;
  onOpenMenu: (message: ChatMessage, x: number, y: number) => void;
  onScrollToReply: (id: string) => void;
}) {
  const time = new Date(message.createdAt).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const pressTimer = useRef<number | null>(null);

  const startPress = (e: React.PointerEvent) => {
    const { clientX, clientY } = e;
    pressTimer.current = window.setTimeout(() => onOpenMenu(message, clientX, clientY), 450);
  };
  const cancelPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  return (
    <div
      data-mid={message.id}
      className={cn(
        "group flex items-end gap-2 px-3",
        mine ? "flex-row-reverse" : "flex-row",
        groupStart ? "mt-3" : "mt-0.5",
      )}
    >
      {!mine &&
        (groupStart ? (
          <ChatAvatar
            userId={message.userId}
            name={message.displayName}
            avatarUrl={message.avatarUrl}
          />
        ) : (
          <span className="w-8 shrink-0" />
        ))}

      <div className={cn("flex min-w-0 flex-col", mine ? "items-end" : "items-start")}>
        <div
          onContextMenu={(e) => {
            e.preventDefault();
            onOpenMenu(message, e.clientX, e.clientY);
          }}
          onPointerDown={startPress}
          onPointerUp={cancelPress}
          onPointerMove={cancelPress}
          onPointerLeave={cancelPress}
          className={cn("rounded-2xl transition-shadow", highlighted && "ring-2 ring-cream/60")}
        >
          <ChatBubble
            mine={mine}
            showName={groupStart}
            name={message.displayName ?? "üye"}
            nameColor={userColor(message.userId)}
            content={message.content}
            time={time}
          >
            {message.replyToId && message.replyToName && (
              <ReplyQuote
                name={message.replyToName}
                snippet={message.replyToSnippet ?? ""}
                onClick={() => onScrollToReply(message.replyToId!)}
              />
            )}
          </ChatBubble>
        </div>
        <ReactionPills reactions={reactions} meId={meId} mine={mine} onToggle={onToggleReaction} />
      </div>

      <button
        type="button"
        aria-label="mesaj menüsü"
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          onOpenMenu(message, mine ? r.left - 180 : r.right, r.top);
        }}
        className="mb-1 hidden h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground/40 transition-colors hover:text-cream group-hover:flex"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
}
