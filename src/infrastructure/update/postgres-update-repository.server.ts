import { sql } from "../db/client.server";
import type { NewUpdate, UpdateItem, UpdateRepository } from "@/domain/update";

interface UpdateRow {
  id: string;
  title: string;
  content: string;
  published_at: Date;
}

const COLS = sql`id, title, content, published_at`;

const toUpdate = (r: UpdateRow): UpdateItem => ({
  id: r.id,
  title: r.title,
  content: r.content,
  publishedAt: r.published_at,
});

export function makeUpdateRepository(): UpdateRepository {
  return {
    async listRecent() {
      const rows = await sql<UpdateRow[]>`select ${COLS} from updates order by published_at desc`;
      return rows.map(toUpdate);
    },

    async create(input: NewUpdate) {
      const [r] = await sql<UpdateRow[]>`
        insert into updates (title, content, published_at)
        values (${input.title}, ${input.content}, ${input.publishedAt})
        returning ${COLS}
      `;
      return toUpdate(r);
    },

    async update(id, input) {
      await sql`
        update updates set title = ${input.title}, content = ${input.content}, published_at = ${input.publishedAt}
        where id = ${id}
      `;
    },

    async delete(id) {
      await sql`delete from updates where id = ${id}`;
    },
  };
}
