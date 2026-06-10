import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { ChatMessage, NewChatMessage } from "@/domain/chat";
import { supabaseChatGateway as gateway } from "@/ui/shared/chat/supabase-chat-gateway";
import { useAuth } from "@/ui/shared/auth/auth-context";

const MESSAGE_LIMIT = 200;

/** Core community chat state: realtime messages + send/delete. */
export function useChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    let active = true;

    gateway
      .loadMessages(MESSAGE_LIMIT)
      .then((m) => active && setMessages(m))
      .catch(() => {})
      .finally(() => active && setLoaded(true));

    gateway
      .memberCount()
      .then((c) => active && setMemberCount(c))
      .catch(() => {});

    const unsubscribe = gateway.subscribeMessages({
      onInsert: (m) =>
        setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m])),
      onDelete: (id) => setMessages((prev) => prev.filter((x) => x.id !== id)),
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const send = useCallback(async (input: NewChatMessage) => {
    try {
      await gateway.sendMessage(input);
    } catch {
      toast.error("Mesaj gönderilemedi.");
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    setMessages((prev) => prev.filter((x) => x.id !== id));
    try {
      await gateway.deleteMessage(id);
    } catch {
      toast.error("Mesaj silinemedi.");
    }
  }, []);

  return { me: user, messages, loaded, memberCount, send, remove };
}
