"use client";

/**
 * HandDrawnFrame — a single-stroke decorative outline (a hand-sketched circle or a
 * five-point star). Presentation-only: it renders the SVG with the path normalised to
 * `pathLength={1}` and hidden (strokeDashoffset:1). The consumer animates `.frame-path`
 * (via GSAP stroke-dashoffset) so the draw can be coordinated with the page's other
 * ScrollTriggers / pin-spacing — mirroring the `.hairline` pattern. Drawing it from a
 * sibling component's ScrollTrigger mis-measures position under a pinned section.
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
  /** Colour of the travelling light that rides the drawing tip */
  glowColor?: string;
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
  glowColor = "rgba(255,247,228,0.95)",
  className,
  style,
}: HandDrawnFrameProps) {
  const { viewBox, d } = SHAPES[shape];

  return (
    <svg
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
        pathLength={1}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        // Hidden by default; the consumer's GSAP draw reveals it (strokeDashoffset 1→0).
        style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
      />
      {/* Travelling light: a short bright dash that rides the drawing tip, with a bloom.
          The consumer's GSAP slides its dashoffset in sync with the draw and fades it. */}
      <path
        className="frame-glow"
        d={d}
        pathLength={1}
        fill="none"
        stroke={glowColor}
        strokeWidth={strokeWidth + 1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: "0.06 0.94",
          strokeDashoffset: 0.06,
          opacity: 0,
          filter:
            "drop-shadow(0 0 4px rgba(255,244,214,0.95)) drop-shadow(0 0 12px rgba(255,232,180,0.55))",
        }}
      />
    </svg>
  );
}

export default HandDrawnFrame;
