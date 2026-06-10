/**
 * User-scoped learning domain: lesson completion, saved lessons, notes.
 * Ports only; Postgres adapters implement them. `userId` is the auth user id.
 */

export interface LessonNote {
  id: string;
  lessonId: string;
  content: string;
  createdAt: Date;
}

/** A note enriched with its lesson/course for the all-notes screen. */
export interface LessonNoteWithTitle extends LessonNote {
  courseId: string;
  lessonTitle: string;
}

/** A saved lesson enriched with display info for the saved-videos screen. */
export interface SavedLessonItem {
  lessonId: string;
  courseId: string;
  title: string;
  thumbnailUrl: string | null;
  durationMinutes: number | null;
}

export interface CompletionRepository {
  /** Lesson ids the user has completed. */
  listCompleted(userId: string): Promise<string[]>;
  setCompleted(userId: string, lessonId: string, done: boolean): Promise<void>;
}

export interface SavedRepository {
  listSavedIds(userId: string): Promise<string[]>;
  listSavedWithLesson(userId: string): Promise<SavedLessonItem[]>;
  setSaved(userId: string, lessonId: string, saved: boolean): Promise<void>;
}

export interface NoteRepository {
  listForLesson(userId: string, lessonId: string): Promise<LessonNote[]>;
  listAll(userId: string): Promise<LessonNoteWithTitle[]>;
  add(userId: string, lessonId: string, content: string): Promise<LessonNote>;
  /** Removes a note only if it belongs to the user. */
  remove(userId: string, noteId: string): Promise<void>;
}
