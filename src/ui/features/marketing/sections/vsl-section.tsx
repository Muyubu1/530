import { Reveal, CinematicVideoFrame } from "@/ui/design-system";

/** "5.30 Nedir?" — black & white cinematic VSL with the bracketed video frame. */
export function VslSection({ videoSrc, poster }: { videoSrc?: string; poster?: string }) {
  return (
    <section id="vsl" className="relative isolate overflow-hidden bg-black text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "3px 3px, 7px 7px",
          backgroundPosition: "0 0, 1px 2px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, transparent 0%, rgba(0,0,0,0.55) 70%, #000 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-28 md:py-36">
        <Reveal variant="fade-down" delay={100} duration={900}>
          <div className="flex flex-col items-center gap-5">
            <span className="h-px w-14 bg-white/25" />
            <span className="font-mono text-[10px] uppercase tracking-[0.6em] text-white/45">
              izle
            </span>
          </div>
        </Reveal>

        <Reveal variant="fade-up" delay={250} duration={1100}>
          <h2
            className="mx-auto mt-10 max-w-3xl text-balance text-center font-normal leading-[1.1] text-white"
            style={{
              fontFamily: '"Cormorant Garamond", "Didot", Georgia, serif',
              fontStyle: "italic",
              fontSize: "2.5rem",
              letterSpacing: "-0.005em",
            }}
          >
            5.30{" "}
            <span style={{ fontWeight: 300 }} className="text-white/55">
              Nedir?
            </span>
          </h2>
        </Reveal>

        <Reveal variant="scale-in" delay={550} duration={1200}>
          <div className="mt-16">
            <CinematicVideoFrame src={videoSrc ?? ""} poster={poster} caption="kısa film · 03:12" />
          </div>
        </Reveal>

        <Reveal variant="fade-up" delay={750} duration={1000}>
          <div className="mt-12 flex flex-col items-center gap-6 md:mt-16">
            <a
              href="#"
              className="group relative inline-flex items-center border border-white/30 px-16 py-6 font-mono text-sm uppercase tracking-[0.55em] text-white/90 transition-all duration-500 hover:border-white hover:bg-white hover:text-black"
            >
              <span>Başvur</span>
            </a>
            <div className="mt-6 flex items-center gap-4 text-white/30">
              <span className="h-px w-16 bg-white/20" />
              <span className="relative inline-block h-1 w-1 rotate-45 bg-white/40" />
              <span className="h-px w-16 bg-white/20" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
