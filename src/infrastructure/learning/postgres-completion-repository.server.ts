import { sql } from "../db/client.server";
import type { CompletionRepository } from "@/domain/learning";

export function makeCompletionRepository(): CompletionRepository {
  return {
    async listCompleted(userId: string): Promise<string[]> {
      const rows = await sql<{ lesson_id: string }[]>`
        select lesson_id from completed_lessons where user_id = ${userId}
      `;
      return rows.map((r) => r.lesson_id);
    },

    async setCompleted(userId: string, lessonId: string, done: boolean): Promise<void> {
      if (done) {
        await sql`
          insert into completed_lessons (user_id, lesson_id)
          values (${userId}, ${lessonId})
          on conflict do nothing
        `;
      } else {
        await sql`
          delete from completed_lessons where user_id = ${userId} and lesson_id = ${lessonId}
        `;
      }
    },
  };
}
