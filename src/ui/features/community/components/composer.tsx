import { useRef, useState } from "react";
import { SendHorizontal, Smile } from "lucide-react";
import { EmojiPicker } from "./emoji-picker";

export function Composer({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  function autosize() {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }

  function submit() {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText("");
    requestAnimationFrame(() => {
      if (ref.current) ref.current.style.height = "auto";
    });
  }

  function pickEmoji(e: string) {
    if (!text.trim()) {
      onSend(e); // single emoji on an empty input sends immediately
    } else {
      setText((t) => t + e);
      requestAnimationFrame(autosize);
    }
    setEmojiOpen(false);
    ref.current?.focus();
  }

  return (
    <div
      className="relative border-t border-border/40 bg-background/80 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {emojiOpen && (
        <div className="absolute bottom-full left-3 mb-2">
          <EmojiPicker onPick={pickEmoji} />
        </div>
      )}
      <div className="flex items-end gap-2 px-3 py-3">
        <div className="flex flex-1 items-end gap-2 rounded-2xl border border-border/60 bg-card/40 px-3 py-2">
          <button
            type="button"
            onClick={() => setEmojiOpen((o) => !o)}
            aria-label="emoji"
            className="mb-0.5 shrink-0 text-muted-foreground/60 transition-colors hover:text-cream"
          >
            <Smile className="h-5 w-5" />
          </button>
          <textarea
            ref={ref}
            rows={1}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              autosize();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="Mesaj yaz…"
            className="max-h-[120px] w-full resize-none bg-transparent text-sm text-cream placeholder:text-muted-foreground/40 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={!text.trim()}
          aria-label="gönder"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream text-background transition-opacity disabled:opacity-40"
        >
          <SendHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
