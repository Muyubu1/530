import { afterAll, expect, test } from "vitest";
import { sql } from "../db/client.server";
import { makeCompletionRepository } from "./postgres-completion-repository.server";
import { makeSavedRepository } from "./postgres-saved-repository.server";
import { makeNoteRepository } from "./postgres-note-repository.server";

// Against the seeded local Postgres. USER/LESSON are fixed fixtures.
const USER = "00000000-0000-0000-0000-0000000000aa";
const OTHER = "00000000-0000-0000-0000-0000000000bb";
const LESSON = "aaaaaaaa-0000-0000-0000-000000000001";

const completion = makeCompletionRepository();
const saved = makeSavedRepository();
const notes = makeNoteRepository();

test("completion toggles and lists", async () => {
  await completion.setCompleted(USER, LESSON, true);
  expect(await completion.listCompleted(USER)).toContain(LESSON);
  await completion.setCompleted(USER, LESSON, true); // idempotent (on conflict do nothing)
  await completion.setCompleted(USER, LESSON, false);
  expect(await completion.listCompleted(USER)).not.toContain(LESSON);
});

test("saved toggles, lists ids, and joins lesson info", async () => {
  await saved.setSaved(USER, LESSON, true);
  expect(await saved.listSavedIds(USER)).toContain(LESSON);
  const items = await saved.listSavedWithLesson(USER);
  expect(items[0]).toMatchObject({ lessonId: LESSON });
  expect(items[0].title).toBeTruthy();
  expect(items[0].courseId).toBeTruthy();
  await saved.setSaved(USER, LESSON, false);
  expect(await saved.listSavedIds(USER)).not.toContain(LESSON);
});

test("notes: add, list, ownership-scoped delete, listAll join", async () => {
  const note = await notes.add(USER, LESSON, "deneme notu");
  expect((await notes.listForLesson(USER, LESSON)).some((n) => n.id === note.id)).toBe(true);

  // A different user cannot delete it.
  await notes.remove(OTHER, note.id);
  expect((await notes.listForLesson(USER, LESSON)).some((n) => n.id === note.id)).toBe(true);

  const all = await notes.listAll(USER);
  const found = all.find((a) => a.id === note.id);
  expect(found?.lessonTitle).toBeTruthy();
  expect(found?.courseId).toBeTruthy();

  await notes.remove(USER, note.id);
  expect((await notes.listForLesson(USER, LESSON)).some((n) => n.id === note.id)).toBe(false);
});

afterAll(async () => {
  await sql`delete from lesson_notes where user_id in (${USER}, ${OTHER})`;
  await sql`delete from completed_lessons where user_id = ${USER}`;
  await sql`delete from saved_lessons where user_id = ${USER}`;
  await sql.end();
});
