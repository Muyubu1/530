import { sql } from "../db/client.server";
import type { EventItem, EventRepository } from "@/domain/event";

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  starts_at: Date;
  location: string | null;
  link: string | null;
}

const toEvent = (r: EventRow): EventItem => ({
  id: r.id,
  title: r.title,
  description: r.description,
  startsAt: r.starts_at,
  location: r.location,
  link: r.link,
});

/** Postgres adapter for {@link EventRepository}. */
export function makeEventRepository(): EventRepository {
  return {
    async listUpcoming(now: Date = new Date()): Promise<EventItem[]> {
      const rows = await sql<EventRow[]>`
        select id, title, description, starts_at, location, link
        from events
        where starts_at >= ${now}
        order by starts_at
      `;
      return rows.map(toEvent);
    },
  };
}
