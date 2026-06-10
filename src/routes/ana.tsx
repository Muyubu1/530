import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/ui/features/marketing/landing-page";
import type { WaitlistData } from "@/ui/shared/waitlist-form";

export const Route = createFileRoute("/ana")({
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
  component: AnaRoute,
});

// TODO(Faz 3): route through an application use-case → Supabase `waitlist` insert.
async function submitWaitlist(_data: WaitlistData) {
  return "ok" as const;
}

function AnaRoute() {
  return <LandingPage onWaitlistSubmit={submitWaitlist} />;
}
