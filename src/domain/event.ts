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

export interface NewEvent {
  title: string;
  description: string | null;
  startsAt: Date;
  location: string | null;
  link: string | null;
}

/** Port: read + admin write access to events. */
export interface EventRepository {
  /** Events starting at or after `now` (defaults to the current time), soonest first. */
  listUpcoming(now?: Date): Promise<EventItem[]>;
  /** ALL events (incl. past), soonest first — admin. */
  listAll(): Promise<EventItem[]>;
  create(input: NewEvent): Promise<EventItem>;
  update(id: string, input: NewEvent): Promise<void>;
  delete(id: string): Promise<void>;
}
