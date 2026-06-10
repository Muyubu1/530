import { Link } from "@tanstack/react-router";
import { Wordmark } from "@/ui/design-system";
import { cn } from "@/lib/utils";

/**
 * Guest (logged-out) site header — absolute over the hero.
 * `tone="ink"` for the light dune landing; `tone="cream"` over dark pages.
 */
export function SiteHeader({ tone = "cream" }: { tone?: "ink" | "cream" }) {
  const ink = tone === "ink";
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="flex w-full items-center justify-between px-6 py-6 md:px-12 md:py-7">
        <Link to="/" aria-label="5.30 ana sayfa">
          <Wordmark tone={tone} />
        </Link>
        <Link
          to="/login"
          className={cn(
            "rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] transition-colors",
            ink
              ? "border-black/50 text-black/85 hover:border-black hover:bg-black hover:text-cream"
              : "border-cream/40 text-cream/85 hover:border-cream hover:bg-cream hover:text-background",
          )}
        >
          giriş
        </Link>
      </div>
    </header>
  );
}
