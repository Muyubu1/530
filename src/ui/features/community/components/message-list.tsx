import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ChatMessage } from "@/domain/chat";
import { buildRenderItems } from "../lib/group-messages";
import { MessageRow } from "./message-row";
import { DateSeparator } from "./date-separator";

const NEAR_BOTTOM_PX = 120;

export function MessageList({
  messages,
  meId,
  onDelete,
}: {
  messages: ChatMessage[];
  meId?: string;
  onDelete: (id: string) => void;
}) {
  const items = useMemo(() => buildRenderItems(messages), [messages]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastCountRef = useRef(0);
  const [unread, setUnread] = useState(0);
  const [atBottom, setAtBottom] = useState(true);

  const isNearBottom = () => {
    const el = scrollRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX;
  };

  const scrollToBottom = (smooth = false) => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  };

  // Auto-scroll on new messages (own or when already near the bottom).
  useEffect(() => {
    const added = messages.length - lastCountRef.current;
    if (added > 0 && lastCountRef.current > 0) {
      const last = messages[messages.length - 1];
      if (last?.userId === meId || isNearBottom()) {
        requestAnimationFrame(() => scrollToBottom());
        setUnread(0);
      } else {
        setUnread((u) => u + added);
      }
    } else if (lastCountRef.current === 0 && messages.length > 0) {
      requestAnimationFrame(() => scrollToBottom());
    }
    lastCountRef.current = messages.length;
  }, [messages, meId]);

  function onScroll() {
    const near = isNearBottom();
    setAtBottom(near);
    if (near) setUnread(0);
  }

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        role="log"
        aria-live="polite"
        className="h-full overflow-y-auto py-3 [scrollbar-width:thin]"
      >
        {items.map((it) =>
          it.kind === "date" ? (
            <DateSeparator key={it.id} label={it.label} />
          ) : (
            <MessageRow
              key={it.message.id}
              message={it.message}
              mine={it.message.userId === meId}
              groupStart={it.groupStart}
              onDelete={it.message.userId === meId ? () => onDelete(it.message.id) : undefined}
            />
          ),
        )}
      </div>

      {!atBottom && (
        <button
          type="button"
          onClick={() => {
            scrollToBottom(true);
            setUnread(0);
          }}
          aria-label="en alta in"
          className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/90 text-cream shadow-lg backdrop-blur"
        >
          <ChevronDown className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cream px-1 font-mono text-[9px] text-background">
              {unread}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
