import { useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";

export function Composer({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState("");
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

  return (
    <div
      className="flex items-end gap-2 border-t border-border/40 bg-background/80 px-3 py-3 backdrop-blur"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
    >
      <div className="flex flex-1 items-end rounded-2xl border border-border/60 bg-card/40 px-3 py-2">
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
  );
}
