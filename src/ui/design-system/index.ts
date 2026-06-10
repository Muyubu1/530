/**
 * Design system public surface.
 * Import the shared visual language from here — never reach into individual files
 * or hardcode token values in features.
 *   import { Button, Section, Eyebrow } from "@/ui/design-system";
 */

// Primitives
export { Button, buttonVariants, type ButtonProps } from "./primitives/button";
export { Eyebrow, type EyebrowProps } from "./primitives/eyebrow";
export { Heading, GradientText, type HeadingProps } from "./primitives/text";
export { Section, Container, type SectionProps, type ContainerProps } from "./primitives/section";
export { Card, type CardProps } from "./primitives/card";
export { FeatureList, FeatureItem } from "./primitives/feature-list";
export { GlowHalo } from "./primitives/glow-halo";
export { Divider } from "./primitives/divider";
export { Wordmark } from "./primitives/wordmark";
export { Reveal } from "./primitives/reveal";

// Backgrounds (decorative, drop inside a relative container)
export {
  DotGrid,
  GridLines,
  ConcentricRings,
  VerticalLines,
  HorizonLine,
  StaticDust,
  MeasureMarks,
} from "./backgrounds/backgrounds";

// Patterns (composed from primitives)
export { CinematicVideoFrame } from "./patterns/cinematic-video-frame";
export { PricingCard, type PricingCardProps } from "./patterns/pricing-card";
export { MediaCard, type MediaCardProps } from "./patterns/media-card";
export { EventCard, type EventCardProps } from "./patterns/event-card";
export { PageHero, type PageHeroProps } from "./patterns/page-hero";
