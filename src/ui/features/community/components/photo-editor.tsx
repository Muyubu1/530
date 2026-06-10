import { useEffect, useRef, useState } from "react";
import { Check, Crop, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
interface TextItem {
  id: string;
  text: string;
  nx: number;
  ny: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const CORNERS = ["tl", "tr", "bl", "br"] as const;
type Corner = (typeof CORNERS)[number];

/** Fullscreen image editor: crop + draggable text overlays + caption. */
export function PhotoEditor({
  file,
  onCancel,
  onSend,
}: {
  file: File;
  onCancel: () => void;
  onSend: (blob: Blob, caption: string) => void;
}) {
  const [url, setUrl] = useState<string>("");
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
  const [crop, setCrop] = useState<Rect>({ x: 0, y: 0, w: 1, h: 1 });
  const [cropMode, setCropMode] = useState(false);
  const [texts, setTexts] = useState<TextItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [sending, setSending] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  // Normalised pointer position inside the displayed image.
  function pointFromEvent(e: PointerEvent | React.PointerEvent) {
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return { nx: 0, ny: 0 };
    return {
      nx: clamp((e.clientX - r.left) / r.width, 0, 1),
      ny: clamp((e.clientY - r.top) / r.height, 0, 1),
    };
  }

  function drag(onMove: (p: { nx: number; ny: number }) => void) {
    const move = (e: PointerEvent) => onMove(pointFromEvent(e));
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function startCropMove(e: React.PointerEvent) {
    e.stopPropagation();
    const start = pointFromEvent(e);
    const orig = { ...crop };
    drag(({ nx, ny }) => {
      const dx = nx - start.nx;
      const dy = ny - start.ny;
      setCrop({
        ...orig,
        x: clamp(orig.x + dx, 0, 1 - orig.w),
        y: clamp(orig.y + dy, 0, 1 - orig.h),
      });
    });
  }

  function startCornerResize(corner: Corner, e: React.PointerEvent) {
    e.stopPropagation();
    drag(({ nx, ny }) => {
      setCrop((c) => {
        const right = c.x + c.w;
        const bottom = c.y + c.h;
        let { x, y } = c;
        let { w, h } = c;
        if (corner === "tl") {
          x = clamp(nx, 0, right - 0.08);
          y = clamp(ny, 0, bottom - 0.08);
          w = right - x;
          h = bottom - y;
        } else if (corner === "tr") {
          y = clamp(ny, 0, bottom - 0.08);
          w = clamp(nx, x + 0.08, 1) - x;
          h = bottom - y;
        } else if (corner === "bl") {
          x = clamp(nx, 0, right - 0.08);
          w = right - x;
          h = clamp(ny, y + 0.08, 1) - y;
        } else {
          w = clamp(nx, x + 0.08, 1) - x;
          h = clamp(ny, y + 0.08, 1) - y;
        }
        return { x, y, w, h };
      });
    });
  }

  function startTextDrag(id: string, e: React.PointerEvent) {
    e.stopPropagation();
    setSelectedId(id);
    drag(({ nx, ny }) => setTexts((prev) => prev.map((t) => (t.id === id ? { ...t, nx, ny } : t))));
  }

  function addText() {
    const id = `t-${texts.length}-${Math.round(Math.random() * 1e6).toString(36)}`;
    setTexts((prev) => [...prev, { id, text: "yazı", nx: 0.5, ny: 0.5 }]);
    setSelectedId(id);
  }

  const selected = texts.find((t) => t.id === selectedId);

  async function handleSend() {
    const img = imgRef.current;
    if (!img || !nat) return;
    setSending(true);
    const cw = Math.max(1, Math.round(crop.w * nat.w));
    const ch = Math.max(1, Math.round(crop.h * nat.h));
    const canvas = document.createElement("canvas");
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setSending(false);
      return;
    }
    ctx.drawImage(img, crop.x * nat.w, crop.y * nat.h, cw, ch, 0, 0, cw, ch);
    const fontPx = Math.round(cw * 0.07);
    ctx.font = `bold ${fontPx}px "Plus Jakarta Sans", system-ui, sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.55)";
    ctx.shadowBlur = fontPx * 0.35;
    for (const t of texts) {
      const tx = ((t.nx - crop.x) / crop.w) * cw;
      const ty = ((t.ny - crop.y) / crop.h) * ch;
      ctx.fillText(t.text, tx, ty);
    }
    canvas.toBlob(
      (blob) => {
        setSending(false);
        if (blob) onSend(blob, caption.trim());
      },
      "image/jpeg",
      0.9,
    );
  }

  const pct = (v: number) => `${v * 100}%`;

  return (
    <div className="fixed inset-0 z-[130] flex flex-col bg-black/95">
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}
      >
        <button type="button" onClick={onCancel} aria-label="iptal" className="text-cream">
          <X className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={handleSend}
          disabled={sending}
          className="flex items-center gap-2 rounded-full bg-cream px-5 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-background disabled:opacity-50"
        >
          {sending ? "gönderiliyor…" : "gönder"}
          <Check className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-hidden p-4">
        <div ref={stageRef} className="relative max-h-full max-w-full select-none">
          {url && (
            <img
              ref={imgRef}
              src={url}
              alt=""
              draggable={false}
              onLoad={(e) =>
                setNat({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })
              }
              className="max-h-[70vh] max-w-full object-contain"
            />
          )}

          {cropMode && (
            <>
              <div
                onPointerDown={startCropMove}
                className="absolute cursor-move border-2 border-cream"
                style={{
                  left: pct(crop.x),
                  top: pct(crop.y),
                  width: pct(crop.w),
                  height: pct(crop.h),
                  boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
                }}
              >
                {CORNERS.map((c) => (
                  <span
                    key={c}
                    onPointerDown={(e) => startCornerResize(c, e)}
                    className="absolute h-4 w-4 rounded-full border-2 border-cream bg-background"
                    style={{
                      left: c.includes("l") ? -8 : undefined,
                      right: c.includes("r") ? -8 : undefined,
                      top: c.includes("t") ? -8 : undefined,
                      bottom: c.includes("b") ? -8 : undefined,
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {texts.map((t) => (
            <span
              key={t.id}
              onPointerDown={(e) => startTextDrag(t.id, e)}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 cursor-move whitespace-nowrap px-1 text-center font-display text-xl font-bold text-white",
                selectedId === t.id && "outline-dashed outline-1 outline-cream/70",
              )}
              style={{
                left: pct(t.nx),
                top: pct(t.ny),
                textShadow: "0 1px 6px rgba(0,0,0,0.6)",
              }}
            >
              {t.text || " "}
            </span>
          ))}
        </div>
      </div>

      <div
        className="space-y-3 px-4 py-3"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
      >
        {selected && (
          <div className="flex items-center gap-2">
            <input
              value={selected.text}
              onChange={(e) =>
                setTexts((prev) =>
                  prev.map((t) => (t.id === selected.id ? { ...t, text: e.target.value } : t)),
                )
              }
              placeholder="yazı"
              className="flex-1 rounded-md border border-border/60 bg-card/40 px-3 py-2 text-sm text-cream focus:border-cream focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setTexts((prev) => prev.filter((t) => t.id !== selected.id));
                setSelectedId(null);
              }}
              aria-label="yazıyı sil"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCropMode((m) => !m)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border",
              cropMode ? "border-cream bg-cream/10 text-cream" : "border-border/60 text-cream/80",
            )}
            aria-label="kırp"
          >
            <Crop className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={addText}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-cream/80"
            aria-label="yazı ekle"
          >
            <Plus className="h-4 w-4" />
          </button>
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="açıklama ekle…"
            className="flex-1 rounded-full border border-border/60 bg-card/40 px-4 py-2.5 text-sm text-cream placeholder:text-muted-foreground/40 focus:border-cream focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
