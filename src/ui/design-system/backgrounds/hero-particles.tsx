import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Cinematic particle field anchored around the hero numerals.
 * Pure CSS — drifting dust, ember sparks, a pulsing halo, faint light rays.
 * The randomised motes mount client-side only to avoid SSR hydration drift;
 * the deterministic halo/rays render immediately.
 */
export function HeroParticles({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const dust = useMemo(
    () =>
      mounted
        ? Array.from({ length: 38 }, (_, i) => ({
            i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            size: 1 + Math.random() * 2.2,
            delay: -Math.random() * 14,
            duration: 10 + Math.random() * 14,
            drift: (Math.random() - 0.5) * 60,
            opacity: 0.25 + Math.random() * 0.5,
          }))
        : [],
    [mounted],
  );

  const sparks = useMemo(
    () =>
      mounted
        ? Array.from({ length: 9 }, (_, i) => ({
            i,
            left: 20 + Math.random() * 60,
            top: 30 + Math.random() * 50,
            delay: -Math.random() * 9,
            duration: 6 + Math.random() * 6,
          }))
        : [],
    [mounted],
  );

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="hero-halo absolute left-1/2 top-[42%] h-[60vw] w-[60vw] max-h-[700px] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <div className="hero-ray hero-ray-a absolute -top-[20%] left-1/2 h-[140%] w-[55%] -translate-x-1/2" />
      <div className="hero-ray hero-ray-b absolute -top-[20%] left-1/2 h-[140%] w-[35%] -translate-x-1/2" />

      {dust.map((d) => (
        <span
          key={`d-${d.i}`}
          className="hero-dust absolute rounded-full bg-black/60"
          style={
            {
              left: `${d.left}%`,
              top: `${d.top}%`,
              width: d.size,
              height: d.size,
              opacity: d.opacity,
              animationDelay: `${d.delay}s`,
              animationDuration: `${d.duration}s`,
              "--drift": `${d.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}

      {sparks.map((s) => (
        <span
          key={`s-${s.i}`}
          className="hero-spark absolute h-[3px] w-[3px] rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
