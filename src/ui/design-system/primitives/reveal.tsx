import * as React from "react";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Variant =
  | "fade-up"
  | "fade-down"
  | "blur-in"
  | "slide-left"
  | "slide-right"
  | "scale-in"
  | "clip-reveal"
  | "letter-rise";

interface RevealProps {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
  as?: keyof React.JSX.IntrinsicElements;
  /** Extra static styles merged under the animation styles (no transform/opacity). */
  style?: React.CSSProperties;
}

const initialStyles: Record<Variant, React.CSSProperties> = {
  "fade-up": { opacity: 0, transform: "translate3d(0, 32px, 0)" },
  "fade-down": { opacity: 0, transform: "translate3d(0, -24px, 0)" },
  "blur-in": { opacity: 0, filter: "blur(18px)", transform: "translate3d(0,12px,0)" },
  "slide-left": { opacity: 0, transform: "translate3d(-48px, 0, 0)" },
  "slide-right": { opacity: 0, transform: "translate3d(48px, 0, 0)" },
  "scale-in": { opacity: 0, transform: "scale(0.92)" },
  "clip-reveal": {
    opacity: 0,
    clipPath: "inset(0 0 100% 0)",
    transform: "translate3d(0,16px,0)",
  },
  "letter-rise": { opacity: 0, transform: "translate3d(0,40px,0)", filter: "blur(8px)" },
};

const activeStyles: React.CSSProperties = {
  opacity: 1,
  transform: "translate3d(0,0,0) scale(1)",
  filter: "blur(0)",
  clipPath: "inset(0 0 0 0)",
};

/** Scroll-triggered entrance animation. IntersectionObserver-based, SSR-safe. */
export function Reveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 1100,
  className,
  once = true,
  threshold = 0.18,
  as: Tag = "div",
  style: extraStyle,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            setShown(false);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, threshold]);

  const style: React.CSSProperties = {
    ...extraStyle,
    transition: `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, filter ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, clip-path ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    willChange: "opacity, transform, filter, clip-path",
    ...(shown ? activeStyles : initialStyles[variant]),
  };

  const Component = Tag as React.ElementType;
  return (
    <Component ref={ref} className={className} style={style}>
      {children}
    </Component>
  );
}
