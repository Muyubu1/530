import { useEffect, useRef, useState } from "react";

// Deterministic barcode bar pattern (varied widths/gaps) — same on every render.
const BARS: Array<{ w: number; gap: number }> = [
  { w: 3, gap: 2 },
  { w: 1, gap: 2 },
  { w: 2, gap: 1 },
  { w: 4, gap: 3 },
  { w: 1, gap: 2 },
  { w: 2, gap: 2 },
  { w: 3, gap: 1 },
  { w: 1, gap: 3 },
  { w: 2, gap: 2 },
  { w: 5, gap: 2 },
  { w: 1, gap: 1 },
  { w: 3, gap: 2 },
  { w: 2, gap: 3 },
  { w: 1, gap: 2 },
  { w: 4, gap: 2 },
  { w: 2, gap: 1 },
  { w: 1, gap: 2 },
  { w: 3, gap: 3 },
  { w: 2, gap: 2 },
  { w: 1, gap: 2 },
  { w: 4, gap: 1 },
  { w: 2, gap: 2 },
  { w: 1, gap: 3 },
  { w: 3, gap: 2 },
  { w: 2, gap: 2 },
  { w: 1, gap: 1 },
  { w: 5, gap: 2 },
  { w: 2, gap: 2 },
  { w: 1, gap: 3 },
  { w: 3, gap: 2 },
  { w: 2, gap: 1 },
  { w: 1, gap: 2 },
];

const GLITCH_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789!@#$%&*<>/\\";
const TARGET = "BAŞVUR";

/** The barcode "BAŞVUR" call-to-action with a glitch-decode hover effect. */
export function BarcodeCTA({ onClick }: { onClick?: () => void }) {
  const [hover, setHover] = useState(false);
  const [text, setText] = useState(TARGET);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!hover) {
      setText(TARGET);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    let frame = 0;
    const total = 24;
    const tick = () => {
      frame++;
      const progress = Math.min(1, frame / total);
      const revealed = Math.floor(progress * TARGET.length);
      let out = "";
      for (let i = 0; i < TARGET.length; i++) {
        if (i < revealed) out += TARGET[i];
        else out += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      }
      setText(out);
      if (frame < total + 6) rafRef.current = requestAnimationFrame(tick);
      else setText(TARGET);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [hover]);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      aria-label="Başvur"
      className="group pointer-events-auto relative flex max-w-[34rem] flex-col items-center gap-3 bg-transparent p-2 text-center outline-none md:gap-5"
    >
      <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-cream/55 md:text-[10px] md:tracking-[0.45em]">
        05 : 30 — oluşum
      </span>

      <div className="relative flex h-16 w-[14rem] items-end justify-center gap-0 md:h-28 md:w-[26rem]">
        {BARS.map((b, i) => (
          <div
            key={i}
            style={{ width: `${b.w * 2}px`, marginRight: `${b.gap * 2}px`, height: "100%" }}
            className="bg-cream/95 transition-all duration-200"
          />
        ))}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-full overflow-hidden opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          aria-hidden
        >
          <div
            className="absolute inset-y-0 w-[2px] bg-cream"
            style={{
              animation: "barcode-scan 1.2s linear infinite",
              boxShadow: "0 0 14px rgba(245,232,210,0.95)",
            }}
          />
        </div>
      </div>

      <span
        className="font-mono text-lg font-light uppercase tracking-[0.5em] text-cream md:text-3xl md:tracking-[0.85em]"
        style={{
          paddingLeft: "0.7em",
          textShadow: "0 0 1px rgba(245,232,210,0.4), 0 0 24px rgba(245,232,210,0.15)",
        }}
      >
        {text}
      </span>

      <p
        className="mt-1 max-w-[20rem] font-mono text-[10px] leading-relaxed text-cream/70 md:max-w-[28rem] md:text-[12px]"
        style={{ letterSpacing: "0.04em" }}
      >
        Saat 5.30'da uyanan, sözünü tutan, kardeşinin yanında duran adamların oluşumu. Disiplin,
        iman ve kardeşlik üzerine kurulu bir yol — kalabalığa değil, kendine hesap veren bir hayata
        davet.
      </p>

      <span className="mt-2 inline-block border-b border-cream/60 pb-1 font-mono text-[10px] tracking-[0.4em] text-cream transition-colors duration-200 group-hover:border-cream md:text-[12px] md:tracking-[0.45em]">
        5.30
      </span>
    </button>
  );
}
