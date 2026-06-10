import * as React from "react";
import { HorizonLine, StaticDust } from "../backgrounds/backgrounds";
import { cn } from "@/lib/utils";

const SCENE_GLOW =
  "radial-gradient(ellipse 70% 50% at 50% 0%, oklch(0.92 0.005 250 / 0.14), transparent 65%), radial-gradient(ellipse 50% 60% at 15% 80%, oklch(0.85 0.01 260 / 0.08), transparent 60%), radial-gradient(ellipse 55% 55% at 90% 70%, oklch(0.88 0.008 240 / 0.07), transparent 60%), linear-gradient(180deg, oklch(1 0 0 / 0.03) 0%, transparent 50%)";

const EDGE_MASK = "linear-gradient(180deg, transparent 0%, black 22%, black 78%, transparent 100%)";

/**
 * The shared program-page backdrop: film grain + vignette over a masked
 * horizon line, faint dust and a cool radial glow. Was copy-pasted verbatim
 * across the kişisel / özel / mentörlük pages — now one module.
 */
export function ProgramScene({
  children,
  className,
  contentClassName,
}: {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden film-grain vignette", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}
      >
        <HorizonLine />
        <StaticDust count={22} />
        <div className="absolute inset-0" style={{ background: SCENE_GLOW }} />
      </div>
      <div
        className={cn(
          "relative mx-auto max-w-3xl px-3 pb-14 pt-20 sm:px-6 md:pb-28 md:pt-44",
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
