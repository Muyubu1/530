import { createFileRoute } from "@tanstack/react-router";
import { ThankYouPage } from "@/ui/features/payment/thank-you-page";

export const Route = createFileRoute("/mentorluk/tesekkurler")({
  validateSearch: (s: Record<string, unknown>): { email?: string } => ({
    email: typeof s.email === "string" ? s.email : undefined,
  }),
  component: MentorlukTesekkurlerRoute,
});

function MentorlukTesekkurlerRoute() {
  return (
    <ThankYouPage
      title="Görüşmek üzere."
      message="Mentörlük randevun için ödemen alındı. En kısa sürede seninle iletişime geçip seansını planlayacağız."
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/50">
        sorun olursa: destek ekibimiz
      </p>
    </ThankYouPage>
  );
}
