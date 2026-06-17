import { createFileRoute } from "@tanstack/react-router";
import { PatikaJourney } from "@/ui/features/patika-demo/patika-journey";

// The member home: the 28-day journey. Login lands here (see /uye/ index redirect).
export const Route = createFileRoute("/uye/patika")({
  component: PatikaJourney,
});
