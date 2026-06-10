import { afterAll, expect, test } from "vitest";
import { sql } from "../db/client.server";
import { makeCourseRepository } from "./postgres-course-repository.server";
import { makeEventRepository } from "../event/postgres-event-repository.server";
import { CourseNotFoundError } from "@/domain/course";

// Integration tests against the seeded local Postgres `refactor530` database.
const courses = makeCourseRepository();
const events = makeEventRepository();

test("lists published courses with ordered lessons (camelCase mapped)", async () => {
  const list = await courses.listPublishedWithLessons();
  expect(list.length).toBeGreaterThanOrEqual(2);

  const first = list[0];
  expect(first.orderIndex).toBe(0);
  expect(first.lessons.length).toBeGreaterThan(0);
  expect(first.lessons[0]).toHaveProperty("courseId");

  const orders = first.lessons.map((l) => l.orderIndex);
  expect(orders).toEqual([...orders].sort((a, b) => a - b));
});

test("fetches a course by id with its lessons", async () => {
  const course = await courses.getByIdWithLessons("11111111-1111-1111-1111-111111111111");
  expect(course.title).toBe("28 Günlük Başlangıç");
  expect(course.lessons).toHaveLength(5);
});

test("throws CourseNotFoundError for a missing id", async () => {
  await expect(
    courses.getByIdWithLessons("99999999-9999-9999-9999-999999999999"),
  ).rejects.toBeInstanceOf(CourseNotFoundError);
});

test("lists upcoming events as Date, soonest first", async () => {
  const list = await events.listUpcoming(new Date("2026-01-01T00:00:00Z"));
  expect(list).toHaveLength(3);
  expect(list[0].startsAt instanceof Date).toBe(true);
  expect(list[0].startsAt.getTime()).toBeLessThanOrEqual(list[1].startsAt.getTime());
});

afterAll(async () => {
  await sql.end();
});
