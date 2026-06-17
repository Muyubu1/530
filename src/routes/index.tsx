import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/ui/features/marketing/landing-page";
import { submitWaitlistFn } from "@/server/waitlist";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "5.30 — Sıradan bir adamdan, sıra dışı bir adama." },
      {
        name: "description",
        content:
          "5.30 bir motivasyon değil, bir sistemdir. Disiplin · İnanç · Birlik. Sözünü tutan adamların birliğine başvur.",
      },
    ],
  }),
  component: LandingRoute,
});

function LandingRoute() {
  return <LandingPage onWaitlistSubmit={(data) => submitWaitlistFn({ data })} />;
}
