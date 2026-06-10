import { Trash2 } from "lucide-react";
import type { ChatMessage } from "@/domain/chat";
import { cn } from "@/lib/utils";
import { userColor } from "../lib/user-color";
import { ChatAvatar } from "./chat-avatar";
import { ChatBubble } from "./chat-bubble";

export function MessageRow({
  message,
  mine,
  groupStart,
  onDelete,
}: {
  message: ChatMessage;
  mine: boolean;
  groupStart: boolean;
  onDelete?: () => void;
}) {
  const time = new Date(message.createdAt).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
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

      <ChatBubble
        mine={mine}
        showName={groupStart}
        name={message.displayName ?? "üye"}
        nameColor={userColor(message.userId)}
        content={message.content}
        time={time}
      />

      {mine && onDelete && (
        <button
          type="button"
          onClick={onDelete}
          aria-label="mesajı sil"
          className="self-center text-transparent transition-colors group-hover:text-muted-foreground/40 hover:!text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
