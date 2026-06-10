import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <p className="font-display text-4xl font-semibold tracking-tight text-cream">5.30</p>
      <p className="mt-6 font-eyebrow text-[11px] text-muted-foreground">refactor530</p>
      <Link
        to="/playground"
        className="mt-10 rounded-full border border-cream/30 px-5 py-2 font-eyebrow text-[10px] text-cream/80 transition-colors hover:border-cream hover:text-cream"
      >
        tasarım sistemi →
      </Link>
    </div>
  );
}
