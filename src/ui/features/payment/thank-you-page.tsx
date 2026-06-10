import type { ReactNode } from "react";
import { ProgramScene, Eyebrow, Heading } from "@/ui/design-system";
import { SiteHeader } from "@/ui/shared/site-header";

export function ThankYouPage({
  eyebrow = "teşekkürler",
  title,
  message,
  children,
}: {
  eyebrow?: string;
  title: string;
  message: string;
  children?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <ProgramScene contentClassName="max-w-md text-center">
        <Eyebrow rule="top" tone="cream" className="justify-center">
          {eyebrow}
        </Eyebrow>
        <Heading as="h1" size="lg" className="mt-6">
          {title}
        </Heading>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground/80">{message}</p>
        {children && <div className="mt-8">{children}</div>}
      </ProgramScene>
    </div>
  );
}
