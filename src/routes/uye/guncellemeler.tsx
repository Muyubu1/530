import { createFileRoute } from "@tanstack/react-router";
import { listUpdatesFn } from "@/server/updates";
import { UpdatesPage } from "@/ui/features/member/updates-page";

export const Route = createFileRoute("/uye/guncellemeler")({
  loader: () => listUpdatesFn(),
  component: UpdatesRoute,
});

function UpdatesRoute() {
  const updates = Route.useLoaderData();
  return <UpdatesPage updates={updates} />;
}
