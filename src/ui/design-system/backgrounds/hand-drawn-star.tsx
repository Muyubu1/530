"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * HandDrawnStar — a single-stroke five-point star (pentagram) that draws itself on
 * with a hand-sketched feel as it scrolls into view. Built on GSAP (the project's
 * animation runtime) via stroke-dashoffset, mirroring the existing `.hairline`
 * draw — no extra animation dependency.
 *
 * Drop it inside a `position: relative` container (e.g. behind the invite card):
 * the card occludes the star's middle so only the points radiate out, framing it
 * like a premium badge. Decorative + pointer-events:none by default.
 */
interface HandDrawnStarProps {
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

// Classic pentagram: top → bottom-right → upper-left → upper-right → bottom-left → close.
// One continuous closed stroke, so pathLength draws as a single sketched gesture.
const STAR_PATH = "M500 32 L688 609 L196 251 L804 251 L312 609 Z";

export function HandDrawnStar({
  color = "rgba(233,238,241,0.6)",
  strokeWidth = 2.5,
  duration = 2.4,
  start = "top 78%",
  className,
  style,
}: HandDrawnStarProps) {
  const rootRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const path = rootRef.current?.querySelector<SVGPathElement>(".star-path");
      if (!path) return;
      gsap.registerPlugin(ScrollTrigger);

      // Respect reduced-motion: show the star fully drawn, skip the animation.
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
    { scope: rootRef },
  );

  return (
    <svg
      ref={rootRef}
      className={className}
      viewBox="0 0 1000 660"
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
        className="star-path"
        d={STAR_PATH}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default HandDrawnStar;
