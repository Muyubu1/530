import type {
  ChatGateway,
  ChatMessage,
  MediaType,
  MessageHandlers,
  NewChatMessage,
  Reaction,
  ReactionHandlers,
} from "@/domain/chat";
import { getSupabaseBrowser } from "../auth/supabase-client";

interface MessageRow {
  id: string;
  user_id: string;
  content: string | null;
  media_url: string | null;
  media_type: MediaType | null;
  created_at: string;
  display_name: string | null;
  avatar_url: string | null;
  reply_to_id: string | null;
  reply_to_snippet: string | null;
  reply_to_name: string | null;
}

interface ReactionRow {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
}

const toMessage = (r: MessageRow): ChatMessage => ({
  id: r.id,
  userId: r.user_id,
  content: r.content,
  mediaUrl: r.media_url,
  mediaType: r.media_type,
  createdAt: r.created_at,
  displayName: r.display_name,
  avatarUrl: r.avatar_url,
  replyToId: r.reply_to_id,
  replyToSnippet: r.reply_to_snippet,
  replyToName: r.reply_to_name,
});

const toReaction = (r: ReactionRow): Reaction => ({
  id: r.id,
  messageId: r.message_id,
  userId: r.user_id,
  emoji: r.emoji,
});

async function sessionUser() {
  const { data } = await getSupabaseBrowser().auth.getSession();
  const u = data.session?.user;
  if (!u) throw new Error("Oturum bulunamadı.");
  const meta = (u.user_metadata ?? {}) as { display_name?: string; avatar_url?: string };
  return {
    id: u.id,
    displayName: meta.display_name ?? u.email?.split("@")[0] ?? null,
    avatarUrl: meta.avatar_url ?? null,
  };
}

/** Supabase implementation of the {@link ChatGateway} (browser, RLS, realtime). */
export const supabaseChatGateway: ChatGateway = {
  async loadMessages(limit) {
    const { data, error } = await getSupabaseBrowser()
      .from("community_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return ((data ?? []) as MessageRow[]).map(toMessage).reverse();
  },

  async sendMessage(input: NewChatMessage) {
    const me = await sessionUser();
    const { error } = await getSupabaseBrowser()
      .from("community_messages")
      .insert({
        user_id: me.id,
        display_name: me.displayName,
        avatar_url: me.avatarUrl,
        content: input.content ?? null,
        media_url: input.mediaUrl ?? null,
        media_type: input.mediaType ?? null,
        reply_to_id: input.replyToId ?? null,
        reply_to_snippet: input.replyToSnippet ?? null,
        reply_to_name: input.replyToName ?? null,
      });
    if (error) throw error;
  },

  async deleteMessage(id) {
    const { error } = await getSupabaseBrowser().from("community_messages").delete().eq("id", id);
    if (error) throw error;
  },

  subscribeMessages({ onInsert, onDelete }: MessageHandlers) {
    const sb = getSupabaseBrowser();
    const channel = sb
      .channel("community_messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "community_messages" },
        (payload) => onInsert(toMessage(payload.new as MessageRow)),
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "community_messages" },
        (payload) => onDelete((payload.old as { id: string }).id),
      )
      .subscribe();
    return () => {
      sb.removeChannel(channel);
    };
  },

  async loadReactions() {
    const { data, error } = await getSupabaseBrowser()
      .from("message_reactions")
      .select("id, message_id, user_id, emoji");
    if (error) throw error;
    return ((data ?? []) as ReactionRow[]).map(toReaction);
  },

  async toggleReaction(messageId, emoji, existingId) {
    const sb = getSupabaseBrowser();
    if (existingId) {
      const { error } = await sb.from("message_reactions").delete().eq("id", existingId);
      if (error) throw error;
      return;
    }
    const me = await sessionUser();
    const { error } = await sb
      .from("message_reactions")
      .insert({ message_id: messageId, user_id: me.id, emoji });
    if (error) throw error;
  },

  subscribeReactions({ onInsert, onDelete }: ReactionHandlers) {
    const sb = getSupabaseBrowser();
    const channel = sb
      .channel("message_reactions")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "message_reactions" },
        (payload) => onInsert(toReaction(payload.new as ReactionRow)),
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "message_reactions" },
        (payload) => onDelete((payload.old as { id: string }).id),
      )
      .subscribe();
    return () => {
      sb.removeChannel(channel);
    };
  },

  async memberCount() {
    const { count } = await getSupabaseBrowser()
      .from("profiles")
      .select("id", { count: "exact", head: true });
    return count ?? 0;
  },

  async uploadMedia(blob, ext) {
    const me = await sessionUser();
    const sb = getSupabaseBrowser();
    const path = `${me.id}/${Date.now()}-${Math.round(Math.random() * 1e9).toString(36)}.${ext}`;
    const { error } = await sb.storage
      .from("community-uploads")
      .upload(path, blob, { contentType: blob.type || undefined, upsert: false });
    if (error) throw error;
    return sb.storage.from("community-uploads").getPublicUrl(path).data.publicUrl;
  },
};
