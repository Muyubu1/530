import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

const LINKS = [
  { to: "/ana", label: "landing (ana)" },
  { to: "/kisisel-program", label: "kişisel program" },
  { to: "/ozel-program", label: "özel program" },
  { to: "/mentorluk", label: "mentörlük" },
  { to: "/uye", label: "üye alanı" },
  { to: "/uye/dersler", label: "üye · dersler" },
  { to: "/uye/etkinlikler", label: "üye · etkinlikler" },
  { to: "/playground", label: "tasarım sistemi" },
] as const;

function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-6 text-foreground">
      <p className="font-display text-4xl font-semibold tracking-tight text-cream">5.30</p>
      <p className="mt-4 font-eyebrow text-[11px] text-muted-foreground">
        refactor530 · geçici hub
      </p>
      <nav className="mt-10 flex flex-col items-center gap-3">
        {LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="rounded-full border border-cream/30 px-5 py-2 font-eyebrow text-[10px] text-cream/80 transition-colors hover:border-cream hover:text-cream"
          >
            {l.label} →
          </Link>
        ))}
      </nav>
    </div>
  );
}
