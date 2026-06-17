import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PatikaJourney } from "./patika-journey";

/** Standalone demo shell at `/patika-demo` — wraps the shared {@link PatikaJourney}. */
export function PatikaDemoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="animate-rise mx-auto max-w-2xl px-5 pb-24 pt-8">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            aria-label="geri"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-cream transition-colors hover:border-cream"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40">
            demo · gerçek veriye bağlı değil
          </span>
          <span className="h-9 w-9" aria-hidden />
        </div>

        <div className="mt-6">
          <PatikaJourney />
        </div>
      </div>
    </div>
  );
}
