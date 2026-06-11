import { Link } from "@tanstack/react-router";
import { CreditCard } from "lucide-react";
import { Eyebrow, Heading, Card, Button } from "@/ui/design-system";

export function SubscriptionPage() {
  return (
    <div className="animate-rise mx-auto max-w-lg">
      <Eyebrow size="sm">benim odam · aboneliğim</Eyebrow>
      <Heading as="h1" size="xl" className="mt-6">
        Aboneliğim
      </Heading>

      <Card variant="subtle" className="mt-8 flex flex-col items-center gap-4 p-8 text-center">
        <CreditCard className="h-7 w-7 text-muted-foreground/40" strokeWidth={1.5} />
        <p className="text-sm leading-relaxed text-muted-foreground/80">
          Aktif bir aboneliğin yok. Programlar tek seferlik satın alınır; süresiz erişimin devam
          eder.
        </p>
        <Button asChild variant="cream" size="sm">
          <Link to="/kisisel-program">programlara göz at</Link>
        </Button>
      </Card>
    </div>
  );
}
