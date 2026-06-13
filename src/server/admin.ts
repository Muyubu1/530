import { createServerFn } from "@tanstack/react-start";
import { sql } from "@/infrastructure/db/client.server";
import { requireAdmin } from "./auth";

export interface AdminStats {
  courses: number;
  lessons: number;
  events: number;
  updates: number;
  materials: number;
  members: number;
  waitlist: number;
  purchases: number;
}

export const adminStatsFn = createServerFn({ method: "GET" })
  .validator((d: { token: string }) => d)
  .handler(async ({ data }): Promise<AdminStats> => {
    await requireAdmin(data.token);
    const [row] = await sql<AdminStats[]>`
      select
        (select count(*) from courses)::int as courses,
        (select count(*) from lessons)::int as lessons,
        (select count(*) from events)::int as events,
        (select count(*) from updates)::int as updates,
        (select count(*) from lesson_materials)::int as materials,
        (select count(*) from profiles)::int as members,
        (select count(*) from waitlist)::int as waitlist,
        (select count(*) from purchases)::int as purchases
    `;
    return row;
  });
