import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/ui/features/marketing/landing-page";
import { submitWaitlistFn } from "@/server/waitlist";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "5.30 Lab — Bir Topluluk Değil. Bir Standart." },
      {
        name: "description",
        content:
          "Disiplinini, bedenini, zihnini ve günlük sistemini yeniden inşa et. 28 günlük başlangıç. 6 aylık dönüşüm.",
      },
    ],
  }),
  component: LandingRoute,
});

function LandingRoute() {
  return <LandingPage onWaitlistSubmit={(data) => submitWaitlistFn({ data })} />;
}
