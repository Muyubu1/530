"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * HandDrawnFrame — a single-stroke decorative outline (a hand-sketched circle or a
 * five-point star) that draws itself on as it scrolls into view. Built on GSAP (the
 * project's animation runtime) via stroke-dashoffset, mirroring the existing
 * `.hairline` draw — no extra animation dependency.
 *
 * Drop it inside a `position: relative` container, behind the content it frames.
 * Decorative + pointer-events:none by default.
 */
type FrameShape = "circle" | "star";

interface HandDrawnFrameProps {
  /** Which outline to draw */
  shape?: FrameShape;
  /** Stroke color */
  color?: string;
  /** Stroke width (in viewBox units) */
  strokeWidth?: number;
  /** Draw duration (s) */
  duration?: number;
  /** ScrollTrigger start (when the draw fires) */
  start?: string;
  className?: string;
  style?: React.CSSProperties;
}

const SHAPES: Record<FrameShape, { viewBox: string; d: string }> = {
  // Wobbly hand-drawn ellipse (wide), good for framing a headline.
  circle: {
    viewBox: "0 0 1200 600",
    d: "M 950 90 C 1250 300, 1050 480, 600 520 C 250 520, 150 480, 150 300 C 150 120, 350 80, 600 80 C 850 80, 950 180, 950 180",
  },
  // Classic pentagram: top → bottom-right → upper-left → upper-right → bottom-left → close.
  star: {
    viewBox: "0 0 1000 660",
    d: "M500 32 L688 609 L196 251 L804 251 L312 609 Z",
  },
};

export function HandDrawnFrame({
  shape = "star",
  color = "rgba(233,238,241,0.6)",
  strokeWidth = 2.5,
  duration = 2.4,
  start = "top 78%",
  className,
  style,
}: HandDrawnFrameProps) {
  const rootRef = useRef<SVGSVGElement>(null);
  const { viewBox, d } = SHAPES[shape];

  useGSAP(
    () => {
      const path = rootRef.current?.querySelector<SVGPathElement>(".frame-path");
      if (!path) return;
      gsap.registerPlugin(ScrollTrigger);

      // Respect reduced-motion: show the outline fully drawn, skip the animation.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(path, { strokeDasharray: "none", strokeDashoffset: 0, opacity: 1 });
        return;
      }

      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration,
        ease: "power1.inOut",
        scrollTrigger: { trigger: rootRef.current, start },
      });
    },
    { scope: rootRef, dependencies: [shape] },
  );

  return (
    <svg
      ref={rootRef}
      className={className}
      viewBox={viewBox}
      fill="none"
      aria-hidden="true"
      style={{
        // Soft premium glow around the sketched stroke.
        filter: "drop-shadow(0 0 8px rgba(233,238,241,0.12))",
        pointerEvents: "none",
        ...style,
      }}
    >
      <path
        className="frame-path"
        d={d}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default HandDrawnFrame;
