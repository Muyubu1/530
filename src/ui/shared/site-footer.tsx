import { Wordmark } from "@/ui/design-system";

/** Guest site footer — wordmark + year, on the cinematic grain band. */
export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-cream/10 bg-black film-grain film-grain-animated scanlines">
      <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_at_top,_rgba(255,225,180,0.08),_transparent_70%)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-12 md:flex-row md:justify-between">
        <Wordmark tone="cream" />
        <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-cream/45">
          MMXXVI · © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
