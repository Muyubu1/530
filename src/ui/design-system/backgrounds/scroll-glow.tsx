import { useEffect, useState } from "react";

/**
 * A cinematic glowing "star" fixed to the viewport that gently trails the
 * visitor down the page as they scroll. Decorative; SSR-safe (rests at scroll 0).
 */
export function ScrollGlow() {
  const [scrollY, setScrollY] = useState(0);
  const [vh, setVh] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    const onResize = () => setVh(window.innerHeight);
    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const drift = Math.min(scrollY * 0.04, vh * 0.15);
  const sway = Math.sin(scrollY / 280) * 14;
  const opacity = 0.95 * Math.min(1, scrollY / 40 + 0.85);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ mixBlendMode: "screen" }}
    >
      <div
        className="absolute left-1/2 top-[58%]"
        style={{
          transform: `translate(calc(-50% + ${sway}px), calc(-50% + ${drift}px))`,
          transition: "opacity 600ms ease",
          opacity,
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 h-[44rem] w-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(200,225,255,0.32) 0%, rgba(180,210,255,0.10) 40%, rgba(160,200,255,0) 75%)",
            animation: "glow-breathe 5.5s ease-in-out infinite",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[22rem] w-16 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(225,238,255,0.6) 0%, rgba(190,215,255,0.2) 55%, transparent 80%)",
            animation: "glow-breathe 4s ease-in-out infinite",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-64 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-md"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(220,235,255,0.7) 25%, #ffffff 50%, rgba(220,235,255,0.7) 75%, transparent 100%)",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          style={{ boxShadow: "0 0 14px 4px rgba(220,235,255,0.95)" }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-px w-40 -translate-x-1/2 -translate-y-1/2"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(220,235,255,0.5), transparent)",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[40rem] w-px -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(220,235,255,0.7) 50%, transparent)",
          }}
        />
      </div>
    </div>
  );
}
