import { ScrollGlow } from "@/ui/design-system";
import { SiteHeader } from "@/ui/shared/site-header";
import { SiteFooter } from "@/ui/shared/site-footer";
import type { WaitlistData, WaitlistResult } from "@/ui/shared/waitlist-form";
import { HeroSection } from "./sections/hero-section";
import { InterludeSection } from "./sections/interlude-section";
import { VslSection } from "./sections/vsl-section";
import stairs from "@/assets/stairs.jpg";

/** The marketing landing page, composed from shared modules and local sections. */
export function LandingPage({
  onWaitlistSubmit,
}: {
  onWaitlistSubmit: (data: WaitlistData) => Promise<WaitlistResult>;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader tone="ink" />
      <ScrollGlow />
      <HeroSection onWaitlistSubmit={onWaitlistSubmit} />
      <InterludeSection />
      <VslSection poster={stairs} />
      <SiteFooter />
    </div>
  );
}
