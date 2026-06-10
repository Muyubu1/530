import { createServerFn } from "@tanstack/react-start";
import { verifyUser } from "./auth";
import * as learning from "@/application/learning";
import { makeCompletionRepository } from "@/infrastructure/learning/postgres-completion-repository.server";
import { makeSavedRepository } from "@/infrastructure/learning/postgres-saved-repository.server";
import { makeNoteRepository } from "@/infrastructure/learning/postgres-note-repository.server";

// All user-scoped: the caller's Supabase access token is verified server-side
// and the real user id is used — the client cannot act as another user.

export const listLessonStateFn = createServerFn({ method: "POST" })
  .validator((d: { token: string }) => d)
  .handler(async ({ data }) => {
    const userId = await verifyUser(data.token);
    const [completedIds, savedIds] = await Promise.all([
      learning.listCompleted(makeCompletionRepository(), userId),
      learning.listSavedIds(makeSavedRepository(), userId),
    ]);
    return { completedIds, savedIds };
  });

export const toggleCompletionFn = createServerFn({ method: "POST" })
  .validator((d: { token: string; lessonId: string; done: boolean }) => d)
  .handler(async ({ data }) => {
    const userId = await verifyUser(data.token);
    await learning.toggleCompletion(makeCompletionRepository(), userId, data.lessonId, data.done);
  });

export const toggleSavedFn = createServerFn({ method: "POST" })
  .validator((d: { token: string; lessonId: string; saved: boolean }) => d)
  .handler(async ({ data }) => {
    const userId = await verifyUser(data.token);
    await learning.toggleSaved(makeSavedRepository(), userId, data.lessonId, data.saved);
  });

export const listNotesForLessonFn = createServerFn({ method: "POST" })
  .validator((d: { token: string; lessonId: string }) => d)
  .handler(async ({ data }) => {
    const userId = await verifyUser(data.token);
    return learning.listNotesForLesson(makeNoteRepository(), userId, data.lessonId);
  });

export const addNoteFn = createServerFn({ method: "POST" })
  .validator((d: { token: string; lessonId: string; content: string }) => d)
  .handler(async ({ data }) => {
    const userId = await verifyUser(data.token);
    return learning.addNote(makeNoteRepository(), userId, data.lessonId, data.content);
  });

export const deleteNoteFn = createServerFn({ method: "POST" })
  .validator((d: { token: string; noteId: string }) => d)
  .handler(async ({ data }) => {
    const userId = await verifyUser(data.token);
    await learning.deleteNote(makeNoteRepository(), userId, data.noteId);
  });

export const listAllNotesFn = createServerFn({ method: "POST" })
  .validator((d: { token: string }) => d)
  .handler(async ({ data }) => {
    const userId = await verifyUser(data.token);
    return learning.listAllNotes(makeNoteRepository(), userId);
  });

export const listSavedLessonsFn = createServerFn({ method: "POST" })
  .validator((d: { token: string }) => d)
  .handler(async ({ data }) => {
    const userId = await verifyUser(data.token);
    return learning.listSavedWithLesson(makeSavedRepository(), userId);
  });
