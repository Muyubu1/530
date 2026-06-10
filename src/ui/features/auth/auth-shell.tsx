import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Section, Container, Eyebrow, Heading, Label, Wordmark } from "@/ui/design-system";

/** Centered cinematic frame shared by all auth screens. */
export function AuthShell({
  eyebrow,
  title,
  children,
  footer,
}: {
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Section grain vignette glow className="min-h-screen bg-background">
      <Container size="sm" className="flex min-h-screen flex-col items-center justify-center py-16">
        <Link to="/" className="mb-10" aria-label="ana sayfa">
          <Wordmark tone="cream" size="md" />
        </Link>
        <div className="w-full max-w-sm">
          <div className="text-center">
            <Eyebrow size="sm" rule="top" tone="cream">
              {eyebrow}
            </Eyebrow>
            <Heading as="h1" size="lg" className="mt-6">
              {title}
            </Heading>
          </div>
          <div className="mt-8">{children}</div>
          {footer && (
            <div className="mt-6 text-center text-xs text-muted-foreground/70">{footer}</div>
          )}
        </div>
      </Container>
    </Section>
  );
}

export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.45.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.95l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

export function GoogleButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="mt-5">
      <div className="mb-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-border/40" />
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/50">
          veya
        </span>
        <span className="h-px flex-1 bg-border/40" />
      </div>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-center gap-3 rounded-md border border-cream/30 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-cream/90 transition-colors hover:border-cream hover:bg-cream/[0.06]"
      >
        <GoogleIcon />
        Google ile devam et
      </button>
    </div>
  );
}
