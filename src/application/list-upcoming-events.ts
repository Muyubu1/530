import type { EventItem, EventRepository } from "@/domain/event";

/** Use-case: list upcoming events, soonest first. */
export function listUpcomingEvents(repo: EventRepository, now?: Date): Promise<EventItem[]> {
  return repo.listUpcoming(now);
}
