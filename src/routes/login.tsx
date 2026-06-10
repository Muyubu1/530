import { createFileRoute, Link } from "@tanstack/react-router";

// Placeholder — real auth screen lands in Faz 3.
export const Route = createFileRoute("/login")({
  component: LoginPlaceholder,
});

function LoginPlaceholder() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-foreground">
      <p className="font-eyebrow text-[11px] text-muted-foreground">giriş · yakında</p>
      <h1 className="mt-4 font-display text-2xl font-medium tracking-tight text-cream">
        Üye girişi
      </h1>
      <p className="mt-3 max-w-sm text-center text-sm text-muted-foreground">
        Bu ekran Faz 3'te (auth) gelecek.
      </p>
      <Link
        to="/ana"
        className="mt-8 rounded-full border border-cream/30 px-5 py-2 font-eyebrow text-[10px] text-cream/80 transition-colors hover:border-cream hover:text-cream"
      >
        ← landing
      </Link>
    </div>
  );
}
