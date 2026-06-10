import { createFileRoute } from "@tanstack/react-router";
import { listUpcomingEventsFn } from "@/server/events";
import { EventsPage } from "@/ui/features/member/events-page";

export const Route = createFileRoute("/uye/etkinlikler")({
  loader: () => listUpcomingEventsFn(),
  component: EventsRoute,
});

function EventsRoute() {
  const events = Route.useLoaderData();
  return <EventsPage events={events} />;
}
