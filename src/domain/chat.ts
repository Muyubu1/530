/**
 * Community chat domain — entities + the realtime gateway port.
 * No framework/Supabase. A client-side adapter implements `ChatGateway`.
 */

export type MediaType = "image" | "audio" | "gif";

export interface ChatMessage {
  id: string;
  userId: string;
  content: string | null;
  mediaUrl: string | null;
  mediaType: MediaType | null;
  /** ISO string (realtime payloads deliver the raw row). */
  createdAt: string;
  displayName: string | null;
  avatarUrl: string | null;
  replyToId: string | null;
  replyToSnippet: string | null;
  replyToName: string | null;
}

export interface NewChatMessage {
  content?: string | null;
  mediaUrl?: string | null;
  mediaType?: MediaType | null;
  replyToId?: string | null;
  replyToSnippet?: string | null;
  replyToName?: string | null;
}

export interface Reaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
}

export interface MessageHandlers {
  onInsert: (message: ChatMessage) => void;
  onDelete: (id: string) => void;
}

export interface ReactionHandlers {
  onInsert: (reaction: Reaction) => void;
  onDelete: (id: string) => void;
}

/** Port: realtime community chat (messages + reactions + media). */
export interface ChatGateway {
  loadMessages(limit: number): Promise<ChatMessage[]>;
  sendMessage(input: NewChatMessage): Promise<void>;
  deleteMessage(id: string): Promise<void>;
  subscribeMessages(handlers: MessageHandlers): () => void;

  loadReactions(): Promise<Reaction[]>;
  /** Adds the reaction, or removes it when `existingId` is given (toggle). */
  toggleReaction(messageId: string, emoji: string, existingId?: string): Promise<void>;
  subscribeReactions(handlers: ReactionHandlers): () => void;

  memberCount(): Promise<number>;
  /** Uploads media to the community bucket and returns a public URL. */
  uploadMedia(blob: Blob, ext: string): Promise<string>;
}
