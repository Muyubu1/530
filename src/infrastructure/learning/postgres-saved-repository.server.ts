import { sql } from "../db/client.server";
import type { SavedLessonItem, SavedRepository } from "@/domain/learning";

interface SavedRow {
  lesson_id: string;
  course_id: string;
  title: string;
  thumbnail_url: string | null;
  duration_minutes: number | null;
}

export function makeSavedRepository(): SavedRepository {
  return {
    async listSavedIds(userId: string): Promise<string[]> {
      const rows = await sql<{ lesson_id: string }[]>`
        select lesson_id from saved_lessons where user_id = ${userId}
      `;
      return rows.map((r) => r.lesson_id);
    },

    async listSavedWithLesson(userId: string): Promise<SavedLessonItem[]> {
      const rows = await sql<SavedRow[]>`
        select l.id as lesson_id, l.course_id, l.title, l.thumbnail_url, l.duration_minutes
        from saved_lessons s
        join lessons l on l.id = s.lesson_id
        where s.user_id = ${userId}
        order by s.created_at desc
      `;
      return rows.map((r) => ({
        lessonId: r.lesson_id,
        courseId: r.course_id,
        title: r.title,
        thumbnailUrl: r.thumbnail_url,
        durationMinutes: r.duration_minutes,
      }));
    },

    async setSaved(userId: string, lessonId: string, saved: boolean): Promise<void> {
      if (saved) {
        await sql`
          insert into saved_lessons (user_id, lesson_id)
          values (${userId}, ${lessonId})
          on conflict do nothing
        `;
      } else {
        await sql`delete from saved_lessons where user_id = ${userId} and lesson_id = ${lessonId}`;
      }
    },
  };
}
