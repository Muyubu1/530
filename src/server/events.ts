import { createServerFn } from "@tanstack/react-start";
import { listUpcomingEvents } from "@/application/list-upcoming-events";
import { makeEventRepository } from "@/infrastructure/event/postgres-event-repository.server";

export const listUpcomingEventsFn = createServerFn({ method: "GET" }).handler(() =>
  listUpcomingEvents(makeEventRepository()),
);
