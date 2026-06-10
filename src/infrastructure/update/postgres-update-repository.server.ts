import { sql } from "../db/client.server";
import type { UpdateItem, UpdateRepository } from "@/domain/update";

interface UpdateRow {
  id: string;
  title: string;
  content: string;
  published_at: Date;
}

export function makeUpdateRepository(): UpdateRepository {
  return {
    async listRecent(): Promise<UpdateItem[]> {
      const rows = await sql<UpdateRow[]>`
        select id, title, content, published_at from updates order by published_at desc
      `;
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        content: r.content,
        publishedAt: r.published_at,
      }));
    },
  };
}
