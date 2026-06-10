import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { ChatMessage, NewChatMessage, Reaction } from "@/domain/chat";
import { supabaseChatGateway as gateway } from "@/ui/shared/chat/supabase-chat-gateway";
import { useAuth } from "@/ui/shared/auth/auth-context";

const MESSAGE_LIMIT = 200;

/** Core community chat state: realtime messages + reactions + send/delete/react. */
export function useChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
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
      .loadReactions()
      .then((r) => active && setReactions(r))
      .catch(() => {});

    gateway
      .memberCount()
      .then((c) => active && setMemberCount(c))
      .catch(() => {});

    const unsubMessages = gateway.subscribeMessages({
      onInsert: (m) =>
        setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m])),
      onDelete: (id) => setMessages((prev) => prev.filter((x) => x.id !== id)),
    });

    const unsubReactions = gateway.subscribeReactions({
      onInsert: (r) =>
        setReactions((prev) => (prev.some((x) => x.id === r.id) ? prev : [...prev, r])),
      onDelete: (id) => setReactions((prev) => prev.filter((x) => x.id !== id)),
    });

    return () => {
      active = false;
      unsubMessages();
      unsubReactions();
    };
  }, []);

  const reactionsByMessage = useMemo(() => {
    const map = new Map<string, Reaction[]>();
    for (const r of reactions) {
      const list = map.get(r.messageId) ?? [];
      list.push(r);
      map.set(r.messageId, list);
    }
    return map;
  }, [reactions]);

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

  const toggleReaction = useCallback(
    async (messageId: string, emoji: string) => {
      const mine = reactions.find(
        (r) => r.messageId === messageId && r.emoji === emoji && r.userId === user?.id,
      );
      if (mine) setReactions((prev) => prev.filter((r) => r.id !== mine.id)); // optimistic remove
      try {
        await gateway.toggleReaction(messageId, emoji, mine?.id);
      } catch {
        toast.error("Reaksiyon kaydedilemedi.");
      }
    },
    [reactions, user],
  );

  return {
    me: user,
    messages,
    reactionsByMessage,
    loaded,
    memberCount,
    send,
    remove,
    toggleReaction,
  };
}
