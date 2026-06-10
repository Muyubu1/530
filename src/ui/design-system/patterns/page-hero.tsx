import * as React from "react";
import { Section } from "../primitives/section";
import { Container, type ContainerProps } from "../primitives/section";
import { Eyebrow } from "../primitives/eyebrow";
import { Heading } from "../primitives/text";
import { cn } from "@/lib/utils";

export interface PageHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** Call-to-action area rendered under the lead. */
  children?: React.ReactNode;
  grain?: boolean | "animated";
  vignette?: boolean;
  scanlines?: boolean;
  glow?: boolean;
  containerSize?: ContainerProps["size"];
  className?: string;
  contentClassName?: string;
}

/** Centered marketing hero scaffold: ambience + eyebrow + heading + lead + CTA. */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
  grain,
  vignette,
  scanlines,
  glow = true,
  containerSize = "md",
  className,
  contentClassName,
}: PageHeroProps) {
  return (
    <Section
      grain={grain}
      vignette={vignette}
      scanlines={scanlines}
      glow={glow}
      className={className}
    >
      <Container
        size={containerSize}
        className={cn("flex flex-col items-center py-24 text-center md:py-36", contentClassName)}
      >
        {eyebrow && (
          <Eyebrow rule="top" tone="cream">
            {eyebrow}
          </Eyebrow>
        )}
        <Heading as="h1" size="xl" className="mt-8 text-balance">
          {title}
        </Heading>
        {lead && (
          <p className="mt-5 max-w-xl text-balance text-sm leading-relaxed text-muted-foreground md:text-base">
            {lead}
          </p>
        )}
        {children && <div className="mt-10">{children}</div>}
      </Container>
    </Section>
  );
}
