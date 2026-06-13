import { sql } from "../db/client.server";
import type { EventItem, EventRepository, NewEvent } from "@/domain/event";

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  starts_at: Date;
  location: string | null;
  link: string | null;
}

const COLS = sql`id, title, description, starts_at, location, link`;

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
    async listUpcoming(now: Date = new Date()) {
      const rows = await sql<EventRow[]>`
        select ${COLS} from events where starts_at >= ${now} order by starts_at
      `;
      return rows.map(toEvent);
    },

    async listAll() {
      const rows = await sql<EventRow[]>`select ${COLS} from events order by starts_at`;
      return rows.map(toEvent);
    },

    async create(input: NewEvent) {
      const [r] = await sql<EventRow[]>`
        insert into events (title, description, starts_at, location, link)
        values (${input.title}, ${input.description}, ${input.startsAt}, ${input.location}, ${input.link})
        returning ${COLS}
      `;
      return toEvent(r);
    },

    async update(id, input) {
      await sql`
        update events set
          title = ${input.title}, description = ${input.description},
          starts_at = ${input.startsAt}, location = ${input.location}, link = ${input.link}
        where id = ${id}
      `;
    },

    async delete(id) {
      await sql`delete from events where id = ${id}`;
    },
  };
}
