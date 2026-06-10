import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MentorlukPage } from "@/ui/features/programs/mentorluk-page";

export const Route = createFileRoute("/mentorluk/")({
  head: () => ({
    meta: [
      { title: "Mentörlük — Halil Mamati'den 1-1 Mentörlük" },
      {
        name: "description",
        content: "Halil Mamati ile bire bir mentörlük. Hayatına yön ver, sorularına çözüm bul.",
      },
    ],
  }),
  component: MentorlukRoute,
});

function MentorlukRoute() {
  const navigate = useNavigate();
  return <MentorlukPage onBook={() => navigate({ to: "/mentorluk/satin-al" })} />;
}
