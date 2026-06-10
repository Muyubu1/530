import type {
  CompletionRepository,
  LessonNote,
  NoteRepository,
  SavedRepository,
} from "@/domain/learning";

const NOTE_MAX = 2000;

export function listCompleted(repo: CompletionRepository, userId: string): Promise<string[]> {
  return repo.listCompleted(userId);
}

export function toggleCompletion(
  repo: CompletionRepository,
  userId: string,
  lessonId: string,
  done: boolean,
): Promise<void> {
  return repo.setCompleted(userId, lessonId, done);
}

export function listSavedIds(repo: SavedRepository, userId: string): Promise<string[]> {
  return repo.listSavedIds(userId);
}

export function listSavedWithLesson(repo: SavedRepository, userId: string) {
  return repo.listSavedWithLesson(userId);
}

export function toggleSaved(
  repo: SavedRepository,
  userId: string,
  lessonId: string,
  saved: boolean,
): Promise<void> {
  return repo.setSaved(userId, lessonId, saved);
}

export function listNotesForLesson(repo: NoteRepository, userId: string, lessonId: string) {
  return repo.listForLesson(userId, lessonId);
}

export function listAllNotes(repo: NoteRepository, userId: string) {
  return repo.listAll(userId);
}

export async function addNote(
  repo: NoteRepository,
  userId: string,
  lessonId: string,
  content: string,
): Promise<LessonNote> {
  const trimmed = content.trim();
  if (!trimmed) throw new Error("Not boş olamaz.");
  if (trimmed.length > NOTE_MAX) throw new Error("Not 2000 karakteri aşamaz.");
  return repo.add(userId, lessonId, trimmed);
}

export function deleteNote(repo: NoteRepository, userId: string, noteId: string): Promise<void> {
  return repo.remove(userId, noteId);
}
