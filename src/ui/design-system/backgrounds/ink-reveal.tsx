"use client";
import { useEffect, useRef, useCallback, useState } from "react";

/**
 * InkReveal — an interactive "discovery veil" for the 5.30 hero.
 *
 * Unlike a plain ink-reveal that lifts an opaque mask off an image, this paints a
 * dark, semi-transparent veil over whatever sits behind it: the scene reads dim by
 * default (the giant 5.30 still glimmers through), and the pointer carves large,
 * soft-edged, lingering ink blots that grow as the hand roams. Carved areas never
 * fully clear (a residual dimness is kept), and edges stay soft ("bulanık"), so the
 * effect feels like wiping frost rather than switching a light on.
 *
 * Drop it as the last child of a `position: relative` container (it fills the parent).
 * Touch and reduced-motion users get a lighter, mostly-visible veil so the page never
 * becomes un-discoverable on devices without a hovering pointer.
 */
interface InkRevealProps {
  /** RGB color of the dark veil, e.g. [7, 10, 14] */
  veilColor?: [number, number, number];
  /** Veil opacity on pointer (hover) devices, 0–1 */
  veilAlpha?: number;
  /** Veil opacity on touch / reduced-motion devices, 0–1 (kept light so the scene stays visible) */
  veilAlphaTouch?: number;
  /** Radius of each ink stamp in px */
  brushSize?: number;
  /** How long each stamp lives before fading (ms) */
  lifetime?: number;
  /** Initial radius before the stamp expands */
  rStart?: number;
  /** Random variation factor for stamp radius (0–1) */
  rVary?: number;
  /** Min pixel distance between stamps along a stroke */
  stampStep?: number;
  /** Max stamps alive at once (oldest are pruned) */
  maxStamps?: number;
  /** Number of segments on the wobble circle (higher = smoother) */
  segments?: number;
  /** Wobble amplitude weights [primary, secondary, tertiary] */
  wobble?: [number, number, number];
  /** Gradient inner-radius factor (0–1, relative to stamp radius) */
  gradientInnerRadius?: number;
  /** Gradient carve strength [center, mid, edge] — center < 1 keeps a residual veil (never fully clear) */
  gradientStops?: [number, number, number];
  /** Extra CSS class for the canvas element */
  className?: string;
  /** Extra inline styles for the canvas element */
  style?: React.CSSProperties;
}

interface Stamp {
  x: number;
  y: number;
  born: number;
  seed: number;
  rmax: number;
}

export function InkReveal({
  veilColor = [7, 10, 14],
  veilAlpha = 0.6,
  veilAlphaTouch = 0.22,
  brushSize = 220,
  lifetime = 1100,
  rStart = 16,
  rVary = 0.45,
  stampStep = 12,
  maxStamps = 200,
  segments = 36,
  wobble = [0.14, 0.08, 0.05],
  gradientInnerRadius = 0.2,
  gradientStops = [0.85, 0.7, 0],
  className,
  style,
}: InkRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stampsRef = useRef<Stamp[]>([]);
  const runningRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const dimsRef = useRef({ w: 0, h: 0 });

  // Devices without a hovering pointer (touch) or users who prefer reduced motion get a
  // lighter veil so the scene stays largely visible without requiring a roaming hand.
  const [reduced, setReduced] = useState(false);
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqHover = window.matchMedia("(hover: none)");
    const sync = () => {
      setReduced(mq.matches);
      setCoarse(mqHover.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    mqHover.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      mqHover.removeEventListener("change", sync);
    };
  }, []);

  const lightMode = reduced || coarse;
  const alpha = lightMode ? veilAlphaTouch : veilAlpha;
  // Reduced-motion users get a static veil (no carving / animation loop).
  const interactive = !reduced;

  const vc = veilColor;
  const fillVeil = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      // Clear first: a translucent fill is composited OVER prior pixels, so without
      // clearing it would accumulate frame-by-frame to near-opaque black (the veil
      // darkening the moment the loop starts). Clearing keeps every frame at exactly `alpha`.
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = `rgba(${vc[0]},${vc[1]},${vc[2]},${alpha})`;
      ctx.fillRect(0, 0, w, h);
    },
    [vc, alpha],
  );

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    // 1.5 cap: the canvas already has blur(1px) + soft gradients, so 1.5 is visually
    // indistinguishable from 2 while clearing/filling/compositing ~44% fewer pixels per frame.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const rect = parent.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    dimsRef.current = { w, h };
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fillVeil(ctx, w, h);
  }, [fillVeil]);

  const carveInk = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, seed: number, a: number) => {
      const g = ctx.createRadialGradient(x, y, r * gradientInnerRadius, x, y, r);
      g.addColorStop(0, `rgba(0,0,0,${gradientStops[0] * a})`);
      g.addColorStop(0.5, `rgba(0,0,0,${gradientStops[1] * a})`);
      g.addColorStop(1, `rgba(0,0,0,${gradientStops[2] * a})`);
      ctx.fillStyle = g;

      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const ang = (i / segments) * Math.PI * 2;
        const wob =
          0.78 +
          wobble[0] * Math.sin(ang * 3 + seed) +
          wobble[1] * Math.sin(ang * 5 + seed * 2.1) +
          wobble[2] * Math.sin(ang * 7 + seed * 0.7);
        const px = x + Math.cos(ang) * r * wob;
        const py = y + Math.sin(ang) * r * wob;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    },
    [segments, wobble, gradientInnerRadius, gradientStops],
  );

  const addStamp = useCallback(
    (x: number, y: number) => {
      const stamps = stampsRef.current;
      if (stamps.length >= maxStamps) stamps.shift();
      stamps.push({
        x,
        y,
        born: performance.now(),
        seed: Math.random() * Math.PI * 2,
        rmax: brushSize * (1 - rVary + Math.random() * rVary),
      });
    },
    [brushSize, rVary, maxStamps],
  );

  const stampAlong = useCallback(
    (x: number, y: number) => {
      const last = lastPosRef.current;
      if (!last) {
        addStamp(x, y);
      } else {
        const dx = x - last.x;
        const dy = y - last.y;
        const dist = Math.hypot(dx, dy);
        const steps = Math.max(1, Math.ceil(dist / stampStep));
        for (let i = 1; i <= steps; i++) {
          addStamp(last.x + (dx * i) / steps, last.y + (dy * i) / steps);
        }
      }
      lastPosRef.current = { x, y };
    },
    [addStamp, stampStep],
  );

  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h } = dimsRef.current;
    const now = performance.now();
    const stamps = stampsRef.current;

    fillVeil(ctx, w, h);
    ctx.globalCompositeOperation = "destination-out";

    for (let i = stamps.length - 1; i >= 0; i--) {
      const t = (now - stamps[i].born) / lifetime;
      if (t >= 1) {
        stamps.splice(i, 1);
        continue;
      }
      const ease = 1 - Math.pow(1 - t, 3);
      const r = rStart + (stamps[i].rmax - rStart) * ease;
      const a = 1 - t * t;
      carveInk(ctx, stamps[i].x, stamps[i].y, r, stamps[i].seed, a);
    }

    if (stamps.length) {
      requestAnimationFrame(loop);
    } else {
      runningRef.current = false;
    }
  }, [carveInk, fillVeil, lifetime, rStart]);

  const startLoop = useCallback(() => {
    if (!runningRef.current) {
      runningRef.current = true;
      requestAnimationFrame(loop);
    }
  }, [loop]);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  // Touch / no-hover devices: the discovery veil is meaningless without a roaming pointer,
  // so render nothing at all (no veil, zero overhead). Desktop (hover) is unaffected.
  // `coarse` starts false on SSR + first paint and flips after mount, so hydration stays safe.
  if (coarse) return null;

  const relPos = (clientX: number, clientY: number, el: HTMLCanvasElement) => {
    const rect = el.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        // Soften the carved edges further so the boundary reads "blurry", not crisp.
        filter: "blur(1px)",
        ...style,
      }}
      onMouseEnter={
        interactive
          ? (e) => {
              const pos = relPos(e.clientX, e.clientY, e.currentTarget);
              lastPosRef.current = pos;
              stampAlong(pos.x, pos.y);
              startLoop();
            }
          : undefined
      }
      onMouseMove={
        interactive
          ? (e) => {
              const pos = relPos(e.clientX, e.clientY, e.currentTarget);
              stampAlong(pos.x, pos.y);
              startLoop();
            }
          : undefined
      }
      onMouseLeave={
        interactive
          ? () => {
              lastPosRef.current = null;
            }
          : undefined
      }
      onTouchStart={
        interactive
          ? (e) => {
              const tch = e.touches[0];
              if (!tch) return;
              const pos = relPos(tch.clientX, tch.clientY, e.currentTarget);
              lastPosRef.current = pos;
              stampAlong(pos.x, pos.y);
              startLoop();
            }
          : undefined
      }
      onTouchMove={
        interactive
          ? (e) => {
              const tch = e.touches[0];
              if (!tch) return;
              const pos = relPos(tch.clientX, tch.clientY, e.currentTarget);
              stampAlong(pos.x, pos.y);
              startLoop();
            }
          : undefined
      }
      onTouchEnd={
        interactive
          ? () => {
              lastPosRef.current = null;
            }
          : undefined
      }
    />
  );
}

export default InkReveal;
