/**
 * Event domain. Named `EventItem` so it never shadows the DOM `Event` type
 * inside `.tsx` files.
 */

export interface EventItem {
  id: string;
  title: string;
  description: string | null;
  startsAt: Date;
  location: string | null;
  link: string | null;
}

/** Port: read access to upcoming events. */
export interface EventRepository {
  /** Events starting at or after `now` (defaults to the current time), soonest first. */
  listUpcoming(now?: Date): Promise<EventItem[]>;
}
