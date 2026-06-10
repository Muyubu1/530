import {
  ProgramScene,
  Reveal,
  Heading,
  GradientText,
  CinematicVideoFrame,
  Card,
  FeatureList,
  FeatureItem,
  Button,
} from "@/ui/design-system";
import { SiteHeader } from "@/ui/shared/site-header";
import silhouettes from "@/assets/hero-men-silhouettes.jpg";

const NEDEN_MENTOR = [
  "Endişelerinizi, korkularınızı veya amaçlarınızı, yargılanmadan anlatır ve çözümler bulursunuz.",
  "Mentör, sizi geliştirmek için sorumluluklar ve görevler verir.",
  "Sinir, stres ve kriz anlarını yönetmenize yardımcı olur.",
  "Kritik kararlar vermeniz gerektiğinde yol gösterir.",
  "Üretkenliğinizi artırır ve kafanızdaki karmaşıklığı giderir.",
  "Farklı bir bakış açısı kazanırsınız, etrafınızdaki fırsatları görmeye başlarsınız.",
];

/** Mentörlük satış sayfası: VSL + "Neden Mentör" + randevu CTA. */
export function MentorlukPage({ onBook, videoSrc }: { onBook: () => void; videoSrc?: string }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <ProgramScene>
        <Reveal variant="fade-down">
          <p className="text-center font-sans text-sm tracking-wide text-gold/90 lg:text-base">
            Kendini ileriye taşımak isteyenler ve zor zamanlarına çözüm arayanlar için:
          </p>
        </Reveal>

        <Reveal variant="blur-in" delay={150} duration={1300}>
          <Heading as="h1" size="xl" className="mx-auto mt-6 text-center">
            Halil'den <GradientText>1-1 Mentörlük Alın</GradientText>
          </Heading>
        </Reveal>

        <Reveal variant="scale-in" delay={400} duration={1100}>
          <div className="mt-10 sm:mt-14">
            <CinematicVideoFrame src={videoSrc ?? ""} poster={silhouettes} />
          </div>
        </Reveal>

        <Reveal variant="fade-up" delay={500}>
          <Card
            variant="elevated"
            className="mx-auto mt-10 max-w-2xl px-5 py-7 sm:mt-14 sm:px-10 sm:py-10"
          >
            <h2 className="text-center font-display text-xl font-medium tracking-tight text-cream sm:text-2xl">
              Neden Mentör?
            </h2>
            <FeatureList className="mt-6 space-y-4 sm:mt-8">
              {NEDEN_MENTOR.map((item) => (
                <FeatureItem key={item} className="sm:text-base">
                  {item}
                </FeatureItem>
              ))}
            </FeatureList>
          </Card>
        </Reveal>

        <Reveal variant="fade-up" threshold={0.05}>
          <div className="mt-10 text-center sm:mt-14">
            <Button
              size="lg"
              className="h-14 px-12 text-base sm:h-16 sm:px-16 sm:text-lg"
              onClick={onBook}
            >
              Randevu Al
            </Button>
          </div>
        </Reveal>
      </ProgramScene>
    </div>
  );
}
