import {
  Reveal,
  HeroParticles,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  GradientText,
} from "@/ui/design-system";
import { WaitlistForm, type WaitlistData, type WaitlistResult } from "@/ui/shared/waitlist-form";
import { BarcodeCTA } from "../components/barcode-cta";
import heroAthletes from "@/assets/hero-athletes-dune.jpg";
import logo530 from "@/assets/logo-530.png";

const SAND_FLOOR = "linear-gradient(180deg, #0a0907 0%, #050403 55%, #000000 100%)";

/** The landing hero: dune photograph, giant wordmark, particles and barcode CTA. */
export function HeroSection({
  onWaitlistSubmit,
}: {
  onWaitlistSubmit: (data: WaitlistData) => Promise<WaitlistResult>;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-black film-grain film-grain-animated">
      <div className="relative h-screen w-full">
        <img
          src={heroAthletes}
          alt="Şafak vakti kumulda koşan atletler"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "48% 61.8%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/85" />
        <HeroParticles className="z-[5]" />

        <div className="pointer-events-none absolute inset-x-0 top-24 z-20 hidden grid-cols-3 gap-6 px-6 font-mono text-[9px] uppercase tracking-[0.32em] text-black/80 md:top-28 md:grid md:px-12">
          <Reveal variant="fade-down" delay={200} duration={900}>
            <div className="space-y-1">
              <p>• Become the man</p>
              <p>• Built different</p>
            </div>
          </Reveal>
          <Reveal variant="fade-down" delay={300} duration={900}>
            <div className="space-y-1 text-left md:text-center">
              <p>• 05:30 AM</p>
              <p>• MMXXVI</p>
            </div>
          </Reveal>
          <Reveal variant="fade-down" delay={400} duration={900}>
            <div className="space-y-1 text-right">
              <p>By</p>
              <p>5.30 / Studio</p>
            </div>
          </Reveal>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-[38.2%] z-10 -translate-y-1/2 px-2 md:px-6">
          <Reveal variant="letter-rise" delay={350} duration={1600}>
            <h1 className="flex items-center justify-center leading-none mix-blend-multiply">
              <span className="sr-only">5.30</span>
              <img
                src={logo530}
                alt="5.30"
                draggable={false}
                className="h-auto w-[78vw] max-w-[1400px] select-none"
                style={{ filter: "brightness(0)" }}
              />
            </h1>
          </Reveal>
          <Reveal variant="fade-up" delay={750} duration={1000}>
            <div className="mt-4 flex items-center justify-center gap-4 font-mono text-[7px] uppercase tracking-[0.3em] text-black/80 md:mt-6 md:gap-20 md:text-[10px] md:tracking-[0.5em]">
              <span>Faith</span>
              <span>Brotherhood</span>
              <span>Mindset</span>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="relative w-full" style={{ background: SAND_FLOOR }}>
        <div
          className="pointer-events-none absolute inset-x-0 -top-24 h-24"
          style={{ background: "linear-gradient(180deg, transparent 0%, #0a0907 100%)" }}
        />
        <div className="relative flex flex-col items-center px-6 py-12 md:py-32">
          <Reveal variant="fade-up" delay={150} duration={1000}>
            <Dialog>
              <DialogTrigger asChild>
                <BarcodeCTA />
              </DialogTrigger>
              <DialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                className="max-w-[22rem] border-gold/30 sm:max-w-sm"
              >
                <DialogHeader>
                  <DialogTitle>
                    İlk Sizin Haberiniz <GradientText>Olacak!</GradientText>
                  </DialogTitle>
                  <DialogDescription>İlk kohort açıldığında haber ver.</DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <WaitlistForm onSubmit={onWaitlistSubmit} />
                </div>
              </DialogContent>
            </Dialog>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
