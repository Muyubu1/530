import { sql } from "../db/client.server";
import type { LessonNote, LessonNoteWithTitle, NoteRepository } from "@/domain/learning";

interface NoteRow {
  id: string;
  lesson_id: string;
  content: string;
  created_at: Date;
}

interface NoteTitleRow extends NoteRow {
  course_id: string;
  lesson_title: string;
}

const toNote = (r: NoteRow): LessonNote => ({
  id: r.id,
  lessonId: r.lesson_id,
  content: r.content,
  createdAt: r.created_at,
});

export function makeNoteRepository(): NoteRepository {
  return {
    async listForLesson(userId: string, lessonId: string): Promise<LessonNote[]> {
      const rows = await sql<NoteRow[]>`
        select id, lesson_id, content, created_at
        from lesson_notes
        where user_id = ${userId} and lesson_id = ${lessonId}
        order by created_at desc
      `;
      return rows.map(toNote);
    },

    async listAll(userId: string): Promise<LessonNoteWithTitle[]> {
      const rows = await sql<NoteTitleRow[]>`
        select n.id, n.lesson_id, n.content, n.created_at, l.course_id, l.title as lesson_title
        from lesson_notes n
        join lessons l on l.id = n.lesson_id
        where n.user_id = ${userId}
        order by n.created_at desc
      `;
      return rows.map((r) => ({
        ...toNote(r),
        courseId: r.course_id,
        lessonTitle: r.lesson_title,
      }));
    },

    async add(userId: string, lessonId: string, content: string): Promise<LessonNote> {
      const [row] = await sql<NoteRow[]>`
        insert into lesson_notes (user_id, lesson_id, content)
        values (${userId}, ${lessonId}, ${content})
        returning id, lesson_id, content, created_at
      `;
      return toNote(row);
    },

    async remove(userId: string, noteId: string): Promise<void> {
      await sql`delete from lesson_notes where id = ${noteId} and user_id = ${userId}`;
    },
  };
}
