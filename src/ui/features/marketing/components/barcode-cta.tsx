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

/** The barcode "BAŞVUR" CTA with a soft, continuous light sweep across the bars. */
export function BarcodeCTA({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Başvur"
      className="group pointer-events-auto relative flex max-w-[34rem] flex-col items-center gap-3 bg-transparent p-2 text-center outline-none md:gap-5"
    >
      <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-cream/55 md:text-[10px] md:tracking-[0.45em]">
        05 : 30 — oluşum
      </span>

      <div className="relative flex h-16 w-[14rem] items-end justify-center gap-0 overflow-hidden md:h-28 md:w-[26rem]">
        {BARS.map((b, i) => (
          <div
            key={i}
            style={{ width: `${b.w * 2}px`, marginRight: `${b.gap * 2}px`, height: "100%" }}
            className="bg-cream/95"
          />
        ))}
        {/* Continuous soft light sweep — flat, no movement of the bars themselves */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/4"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(245,232,210,0.9), transparent)",
            mixBlendMode: "screen",
            filter: "blur(2px)",
            animation: "barcode-shine 4s linear infinite",
          }}
        />
      </div>

      <span
        className="font-mono text-lg font-light uppercase tracking-[0.5em] text-cream md:text-3xl md:tracking-[0.85em]"
        style={{
          paddingLeft: "0.7em",
          textShadow: "0 0 1px rgba(245,232,210,0.4), 0 0 24px rgba(245,232,210,0.15)",
        }}
      >
        BAŞVUR
      </span>

      <p
        className="mt-1 max-w-[20rem] font-mono text-[10px] leading-relaxed text-cream/70 md:max-w-[28rem] md:text-[12px]"
        style={{ letterSpacing: "0.04em" }}
      >
        Saat 5.30'da uyanan, sözünü tutan, kardeşinin yanında duran adamların oluşumu. Disiplin,
        iman ve kardeşlik üzerine kurulu bir yol — kalabalığa değil, kendine hesap veren bir hayata
        davet.
      </p>

      <span className="mt-2 inline-block border-b border-cream/40 pb-1 font-mono text-[10px] tracking-[0.4em] text-cream/90 transition-colors duration-300 group-hover:border-cream group-hover:text-cream md:text-[12px] md:tracking-[0.45em]">
        5.30
      </span>
    </button>
  );
}
