import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/playground")({
  component: Playground,
});

// Visual catalogue of the design system. Populated in Faz 1 as primitives land.
function Playground() {
  return (
    <div className="min-h-screen bg-background px-6 py-20 text-foreground">
      <div className="mx-auto max-w-5xl">
        <p className="font-eyebrow text-[11px] text-muted-foreground">
          tasarım sistemi · playground
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-cream">
          Bileşen kataloğu
        </h1>
        <p className="mt-3 max-w-prose text-sm text-muted-foreground">
          Primitive ve pattern bileşenleri bu sayfada görsel olarak doğrulanır.
        </p>
      </div>
    </div>
  );
}
