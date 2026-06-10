import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { ChatMessage, NewChatMessage } from "@/domain/chat";
import { useChat } from "./use-chat";
import { MessageList, type MessageListHandle } from "./components/message-list";
import { Composer } from "./components/composer";
import { ReplyBar } from "./components/reply-bar";
import { PinnedBar } from "./components/pinned-bar";
import { ContextMenu } from "./components/context-menu";
import { EmojiPicker } from "./components/emoji-picker";
import { ImageViewer } from "./components/image-viewer";
import { PhotoEditor } from "./components/photo-editor";

const snippetOf = (m: ChatMessage) => (m.content ?? "📎 medya").slice(0, 80);

export function ChatPage() {
  const {
    me,
    messages,
    reactionsByMessage,
    loaded,
    memberCount,
    send,
    sendMedia,
    remove,
    toggleReaction,
  } = useChat();

  const [replyTarget, setReplyTarget] = useState<ChatMessage | null>(null);
  const [pinned, setPinned] = useState<ChatMessage | null>(null);
  const [menu, setMenu] = useState<{ message: ChatMessage; x: number; y: number } | null>(null);
  const [reactPickerFor, setReactPickerFor] = useState<ChatMessage | null>(null);
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [editorFile, setEditorFile] = useState<File | null>(null);
  const listRef = useRef<MessageListHandle>(null);

  function handleSend(text: string) {
    const input: NewChatMessage = { content: text };
    if (replyTarget) {
      input.replyToId = replyTarget.id;
      input.replyToName = replyTarget.displayName ?? "üye";
      input.replyToSnippet = snippetOf(replyTarget);
    }
    send(input);
    setReplyTarget(null);
  }

  function copyMessage(m: ChatMessage) {
    if (m.content)
      navigator.clipboard?.writeText(m.content).then(() => toast.success("Kopyalandı."));
  }

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

      {pinned && (
        <PinnedBar
          message={pinned}
          onScrollTo={() => listRef.current?.scrollToMessage(pinned.id)}
          onClose={() => setPinned(null)}
        />
      )}

      {loaded && messages.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-muted-foreground/60">İlk mesajı sen yaz 👋</p>
        </div>
      ) : (
        <MessageList
          ref={listRef}
          messages={messages}
          meId={me?.id}
          reactionsByMessage={reactionsByMessage}
          onToggleReaction={toggleReaction}
          onOpenMenu={(message, x, y) => setMenu({ message, x, y })}
          onScrollToReply={(id) => listRef.current?.scrollToMessage(id)}
          onOpenImage={(url) => setViewerUrl(url)}
        />
      )}

      {replyTarget && (
        <ReplyBar
          name={replyTarget.displayName ?? "üye"}
          snippet={snippetOf(replyTarget)}
          onCancel={() => setReplyTarget(null)}
        />
      )}

      <Composer
        onSend={handleSend}
        onPickImage={(file) => setEditorFile(file)}
        onAudio={({ blob, ext }) => sendMedia(blob, ext, "audio")}
      />

      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          mine={menu.message.userId === me?.id}
          canCopy={!!menu.message.content}
          onReact={(e) => toggleReaction(menu.message.id, e)}
          onMoreEmoji={() => {
            setReactPickerFor(menu.message);
            setMenu(null);
          }}
          onReply={() => setReplyTarget(menu.message)}
          onPin={() => setPinned(menu.message)}
          onCopy={() => copyMessage(menu.message)}
          onDelete={() => remove(menu.message.id)}
          onClose={() => setMenu(null)}
        />
      )}

      {reactPickerFor && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setReactPickerFor(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <EmojiPicker
              onPick={(e) => {
                toggleReaction(reactPickerFor.id, e);
                setReactPickerFor(null);
              }}
            />
          </div>
        </div>
      )}

      {viewerUrl && <ImageViewer url={viewerUrl} onClose={() => setViewerUrl(null)} />}

      {editorFile && (
        <PhotoEditor
          file={editorFile}
          onCancel={() => setEditorFile(null)}
          onSend={(blob, caption) => {
            sendMedia(blob, "jpg", "image", caption || undefined);
            setEditorFile(null);
          }}
        />
      )}
    </div>
  );
}
