import { Reveal } from "@/ui/design-system";

/** The silent cinematic interlude between the hero and the VSL. */
export function InterludeSection() {
  return (
    <section
      aria-hidden="true"
      className="relative isolate flex min-h-[55vh] items-center justify-center overflow-hidden bg-black py-24"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(210,225,245,0.06) 0%, transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, rgba(200,220,245,0.22) 35%, rgba(225,235,250,0.4) 50%, rgba(200,220,245,0.22) 65%, transparent 100%)",
          filter: "blur(1px)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[120px] -translate-y-1/2 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 50%, rgba(195,215,240,0.10) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <Reveal variant="fade-up" delay={100} duration={1400}>
        <div className="relative flex flex-col items-center gap-10 text-center">
          <span className="h-24 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />
          <p
            className="max-w-md px-6 leading-[1.45] text-white/55"
            style={{
              fontFamily: '"Cormorant Garamond", "Didot", Georgia, serif',
              fontSize: "1.3rem",
              fontStyle: "italic",
              letterSpacing: "0.005em",
            }}
          >
            Sıradan bir adamdan, sıra dışı bir adama dönüşme sistemi.
          </p>
          <span className="font-mono text-[9px] uppercase tracking-[0.55em] text-white/30">
            aşağı kaydır
          </span>
          <span className="h-24 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />
        </div>
      </Reveal>
    </section>
  );
}
