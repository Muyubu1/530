/**
 * Minimal mono backgrounds — pure CSS / SVG, no deps.
 * Each component is `absolute inset-0` and decorative (aria-hidden).
 * Drop one inside a `relative` container (e.g. <Section>) to add ambience.
 */
import * as React from "react";
import { useEffect, useRef, useState } from "react";

export function DotGrid({ opacity = 0.18 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        opacity,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
      }}
    />
  );
}

export function GridLines({ opacity = 0.1 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        opacity,
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
        maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
      }}
    />
  );
}

export function ConcentricRings() {
  const rings = 14;
  const ref = useRef<HTMLDivElement | null>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setPlay(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full ring-spin-slow"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1200 800"
      >
        <defs>
          <radialGradient id="ring-fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.22" />
            <stop offset="55%" stopColor="white" stopOpacity="0.08" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ring-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.6" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g style={{ transformOrigin: "600px 400px" }} className="ring-spin-rev">
          <circle
            cx="600"
            cy="400"
            r="520"
            fill="none"
            stroke="url(#ring-glow)"
            strokeWidth="0.4"
            strokeDasharray="2 14"
            opacity="0.55"
          />
        </g>

        <g
          fill="none"
          stroke="url(#ring-fade)"
          strokeWidth="0.6"
          style={{ transformOrigin: "600px 400px" }}
        >
          {Array.from({ length: rings }).map((_, i) => {
            const r = 60 + i * 38;
            const circumference = 2 * Math.PI * r;
            return (
              <circle
                key={i}
                cx="600"
                cy="400"
                r={r}
                strokeDasharray={circumference}
                strokeDashoffset={play ? 0 : circumference}
                className={play ? "ring-trace" : ""}
                style={
                  {
                    animationDelay: `${i * 90}ms`,
                    transformOrigin: "600px 400px",
                    "--ring-circ": `${circumference}`,
                  } as React.CSSProperties
                }
              />
            );
          })}
        </g>

        <g style={{ transformOrigin: "600px 400px" }} className="ring-sweep">
          <line
            x1="600"
            y1="400"
            x2="600"
            y2="-200"
            stroke="white"
            strokeOpacity="0.18"
            strokeWidth="0.4"
          />
        </g>

        <g stroke="rgba(255,255,255,0.55)" strokeWidth="0.5" className="ring-cross">
          <line x1="588" y1="400" x2="612" y2="400" />
          <line x1="600" y1="388" x2="600" y2="412" />
          <circle cx="600" cy="400" r="2" fill="white" fillOpacity="0.7" />
        </g>
      </svg>
    </div>
  );
}

export function VerticalLines() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <defs>
        <linearGradient id="vline" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="50%" stopColor="white" stopOpacity="0.35" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[8, 22, 38, 50, 62, 78, 92].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2="100" stroke="url(#vline)" strokeWidth="0.08" />
      ))}
    </svg>
  );
}

export function HorizonLine() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div
        className="absolute left-1/2 top-1/2 hidden h-px w-[140%] -translate-x-1/2 -translate-y-1/2 md:block"
        style={{
          background: "linear-gradient(to right, transparent, rgba(255,255,255,0.35), transparent)",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15"
        style={{ width: "62vmin", height: "62vmin" }}
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8"
        style={{ width: "86vmin", height: "86vmin" }}
      />
    </div>
  );
}

/** Tiny static particles — much lighter than a canvas field. */
export function StaticDust({ count = 40 }: { count?: number }) {
  const seeds = Array.from({ length: count }, (_, i) => {
    const x = (i * 73) % 100;
    const y = (i * 131) % 100;
    const s = ((i * 17) % 3) + 1;
    const o = (((i * 41) % 50) + 20) / 100;
    const d = ((i * 23) % 6) + 3;
    return { x, y, s, o, d, i };
  });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {seeds.map((p) => (
        <span
          key={p.i}
          className="animate-ember-pulse absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
            opacity: p.o,
            animationDuration: `${p.d}s`,
            boxShadow: `0 0 ${p.s * 4}px rgba(255,255,255,${p.o * 0.6})`,
          }}
        />
      ))}
    </div>
  );
}

/** Tick marks along edges — like a measurement scale. */
export function MeasureMarks() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      {Array.from({ length: 40 }).map((_, i) => {
        const major = i % 5 === 0;
        const len = major ? 1.5 : 0.7;
        return (
          <g key={i} stroke="white" strokeOpacity={major ? 0.35 : 0.18} strokeWidth="0.08">
            <line x1={i * 2.5} y1="0" x2={i * 2.5} y2={len} />
            <line x1={i * 2.5} y1={100 - len} x2={i * 2.5} y2="100" />
            <line x1="0" y1={i * 2.5} x2={len} y2={i * 2.5} />
            <line x1={100 - len} y1={i * 2.5} x2="100" y2={i * 2.5} />
          </g>
        );
      })}
    </svg>
  );
}
