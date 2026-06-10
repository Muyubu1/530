import { useRef, useState } from "react";
import { Mic, Paperclip, SendHorizontal, Smile, X } from "lucide-react";
import { EmojiPicker } from "./emoji-picker";
import { useAudioRecorder } from "../use-audio-recorder";

const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

export function Composer({
  onSend,
  onPickImage,
  onAudio,
}: {
  onSend: (text: string) => void;
  onPickImage: (file: File) => void;
  onAudio: (clip: { blob: Blob; ext: string }) => void;
}) {
  const [text, setText] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { recording, seconds, start, stop, cancel } = useAudioRecorder();

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
    if (!text.trim()) onSend(e);
    else {
      setText((t) => t + e);
      requestAnimationFrame(autosize);
    }
    setEmojiOpen(false);
    ref.current?.focus();
  }

  async function finishRecording() {
    const clip = await stop();
    if (clip) onAudio(clip);
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) onPickImage(f);
    e.target.value = "";
  }

  if (recording) {
    return (
      <div
        className="flex items-center gap-3 border-t border-border/40 bg-background/80 px-4 py-3 backdrop-blur"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
      >
        <button
          type="button"
          onClick={cancel}
          aria-label="kaydı iptal et"
          className="text-muted-foreground/70"
        >
          <X className="h-5 w-5" />
        </button>
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
        <span className="flex-1 font-mono text-sm text-cream">{fmt(seconds)}</span>
        <button
          type="button"
          onClick={finishRecording}
          aria-label="sesli mesajı gönder"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-background"
        >
          <SendHorizontal className="h-4 w-4" />
        </button>
      </div>
    );
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
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
      <div className="flex items-end gap-2 px-3 py-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          aria-label="görsel ekle"
          className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center text-muted-foreground/60 transition-colors hover:text-cream"
        >
          <Paperclip className="h-5 w-5" />
        </button>
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
        {text.trim() ? (
          <button
            type="button"
            onClick={submit}
            aria-label="gönder"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream text-background"
          >
            <SendHorizontal className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={start}
            aria-label="sesli mesaj kaydet"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border/60 text-cream transition-colors hover:border-cream"
          >
            <Mic className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
