import { createFileRoute } from "@tanstack/react-router";
import {
  Button,
  Card,
  Container,
  Divider,
  Eyebrow,
  FeatureItem,
  FeatureList,
  GlowHalo,
  GradientText,
  Heading,
  Reveal,
  Section,
  Wordmark,
  ConcentricRings,
  DotGrid,
  StaticDust,
} from "@/ui/design-system";

export const Route = createFileRoute("/playground")({
  component: Playground,
});

/** Living catalogue of the design system. Every shared module renders here. */
function Playground() {
  return (
    <div className="min-h-screen bg-background pb-32 text-foreground">
      <Container size="lg" className="py-20">
        <Eyebrow size="md">tasarım sistemi · playground</Eyebrow>
        <Heading as="h1" size="xl" className="mt-4">
          Bileşen <GradientText>kataloğu</GradientText>
        </Heading>
        <p className="mt-3 max-w-prose text-sm text-muted-foreground">
          Tüm primitive bileşenler tek tasarım dilinden türer. Ekranlar bunları diziye dizer — ham
          stil tekrar etmez.
        </p>
      </Container>

      <Catalog title="Wordmark">
        <div className="flex flex-wrap items-center gap-8 rounded-xl border border-border/40 bg-card/30 p-6">
          <Wordmark tone="cream" />
          <Wordmark tone="full" size="md" />
          <div className="rounded-md bg-cream px-4 py-3">
            <Wordmark tone="ink" />
          </div>
        </div>
      </Catalog>

      <Catalog title="Eyebrow">
        <div className="flex flex-col gap-4 rounded-xl border border-border/40 bg-card/30 p-6">
          <Eyebrow size="sm">küçük etiket</Eyebrow>
          <Eyebrow size="md" rule="left">
            sol çizgi
          </Eyebrow>
          <Eyebrow size="lg" rule="top">
            üst çizgi
          </Eyebrow>
        </div>
      </Catalog>

      <Catalog title="Heading">
        <div className="space-y-4 rounded-xl border border-border/40 bg-card/30 p-6">
          <Heading size="sm">Küçük başlık</Heading>
          <Heading size="md">Orta başlık</Heading>
          <Heading size="lg">
            Büyük başlık <GradientText>vurgulu</GradientText>
          </Heading>
          <Heading size="xl">Dev başlık</Heading>
        </div>
      </Catalog>

      <Catalog title="Button">
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/40 bg-card/30 p-6">
          <Button variant="default">Ödemeye Geç</Button>
          <Button variant="secondary">İkincil</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Katıl</Button>
          <Button variant="cream" size="lg">
            İzlemeye Devam Et
          </Button>
          <Button variant="cta" size="xl">
            Başvur
          </Button>
          <Button variant="pill">Giriş</Button>
        </div>
      </Catalog>

      <Catalog title="Card + FeatureList">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <Eyebrow size="sm">default</Eyebrow>
            <Heading size="sm" className="mt-3">
              Standart kart
            </Heading>
            <FeatureList className="mt-5">
              <FeatureItem>Bire bir kişisel oturumlar</FeatureItem>
              <FeatureItem>Kişiye özel yol haritası</FeatureItem>
              <FeatureItem>Sınırsız mesajlaşma desteği</FeatureItem>
            </FeatureList>
          </Card>
          <Card variant="elevated" className="p-6">
            <Eyebrow size="sm">elevated</Eyebrow>
            <Heading size="sm" className="mt-3">
              Yükseltilmiş kart
            </Heading>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground/80">
              Hero kartlarındaki katmanlı glow gölgesi.
            </p>
            <Button variant="cream" size="lg" className="mt-6 w-full">
              Ödemeye Geç
            </Button>
          </Card>
        </div>
      </Catalog>

      <Catalog title="Divider">
        <div className="space-y-8 rounded-xl border border-border/40 bg-card/30 p-8">
          <Divider variant="diamond" />
          <Divider variant="line" />
          <Divider variant="dot" />
        </div>
      </Catalog>

      <Catalog title="GlowHalo">
        <div className="rounded-xl border border-border/40 bg-card/30 p-12">
          <div className="relative mx-auto max-w-sm">
            <GlowHalo />
            <Card className="relative p-6 text-center">
              <Heading size="sm">Glow ardında</Heading>
            </Card>
          </div>
        </div>
      </Catalog>

      <Catalog title="Section — ambience (grain · vignette · scanlines · glow)">
        <Section
          grain="animated"
          vignette
          scanlines
          glow
          className="rounded-xl border border-border/40 bg-black"
          contentClassName="px-6 py-16 text-center"
        >
          <Eyebrow rule="top" tone="cream">
            atmosfer
          </Eyebrow>
          <Heading size="lg" className="mt-6">
            Tek bileşen, tüm sinema
          </Heading>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            film-grain, vignette, scanlines ve glow artık prop.
          </p>
        </Section>
      </Catalog>

      <Catalog title="Backgrounds">
        <div className="grid gap-6 md:grid-cols-3">
          <BgTile label="DotGrid">
            <DotGrid />
          </BgTile>
          <BgTile label="StaticDust">
            <StaticDust count={30} />
          </BgTile>
          <BgTile label="ConcentricRings">
            <ConcentricRings />
          </BgTile>
        </div>
      </Catalog>

      <Catalog title="Reveal (scroll'da görünür)">
        <div className="rounded-xl border border-border/40 bg-card/30 p-10">
          <Reveal variant="fade-up">
            <Heading size="md">Kaydırınca yükselerek belirir</Heading>
          </Reveal>
        </div>
      </Catalog>
    </div>
  );
}

function Catalog({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Container size="lg" className="mt-16">
      <p className="mb-5 font-eyebrow text-[10px] tracking-[0.4em] text-muted-foreground/70">
        {title}
      </p>
      {children}
    </Container>
  );
}

function BgTile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative h-44 overflow-hidden rounded-xl border border-border/40 bg-black">
      {children}
      <span className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.25em] text-cream/50">
        {label}
      </span>
    </div>
  );
}
