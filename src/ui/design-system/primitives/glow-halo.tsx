import { cn } from "@/lib/utils";

/** Soft radial light bloom placed behind a card/element. Parent must be `relative`. */
export function GlowHalo({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute -inset-10 rounded-[2.5rem] blur-3xl", className)}
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(255,255,255,0.35), rgba(255,255,255,0.12) 45%, transparent 75%)",
      }}
    />
  );
}
