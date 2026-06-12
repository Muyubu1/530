import { createFileRoute } from "@tanstack/react-router";
import { PatikaDemoPage } from "@/ui/features/patika-demo/demo-page";

export const Route = createFileRoute("/patika-demo")({
  component: PatikaDemoPage,
});
