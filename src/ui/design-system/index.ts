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
export { Input } from "./primitives/input";
export { Label } from "./primitives/label";
export { Checkbox } from "./primitives/checkbox";
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./primitives/dialog";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./primitives/dropdown-menu";

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
export { HeroParticles } from "./backgrounds/hero-particles";
export { ScrollGlow } from "./backgrounds/scroll-glow";
export { InkReveal } from "./backgrounds/ink-reveal";
export { HandDrawnFrame } from "./backgrounds/hand-drawn-frame";

// Patterns (composed from primitives)
export { CinematicVideoFrame } from "./patterns/cinematic-video-frame";
export { PricingCard, type PricingCardProps } from "./patterns/pricing-card";
export { MediaCard, type MediaCardProps } from "./patterns/media-card";
export { EventCard, type EventCardProps } from "./patterns/event-card";
export { PageHero, type PageHeroProps } from "./patterns/page-hero";
export { ProgramScene } from "./patterns/program-scene";
export { LessonThumb, type LessonThumbProps } from "./patterns/lesson-thumb";
