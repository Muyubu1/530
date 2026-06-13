import { createServerFn } from "@tanstack/react-start";
import type { NewCourse, NewLesson } from "@/domain/course";
import type { NewMaterial } from "@/domain/material";
import { makeCourseRepository } from "@/infrastructure/course/postgres-course-repository.server";
import { makeEventRepository } from "@/infrastructure/event/postgres-event-repository.server";
import { makeUpdateRepository } from "@/infrastructure/update/postgres-update-repository.server";
import { makeMaterialRepository } from "@/infrastructure/material/postgres-material-repository.server";
import { requireAdmin } from "./auth";

// Over-the-wire shapes (dates as ISO strings).
interface EventInput {
  title: string;
  description: string | null;
  startsAt: string;
  location: string | null;
  link: string | null;
}
interface UpdateInput {
  title: string;
  content: string;
  publishedAt: string;
}

// ───────────────────────── courses + lessons ─────────────────────────
export const listCoursesAdminFn = createServerFn({ method: "GET" })
  .validator((d: { token: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    return makeCourseRepository().listAllWithLessons();
  });

export const createCourseFn = createServerFn({ method: "POST" })
  .validator((d: { token: string; course: NewCourse }) => d)
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    return makeCourseRepository().createCourse(data.course);
  });

export const updateCourseFn = createServerFn({ method: "POST" })
  .validator((d: { token: string; id: string; course: NewCourse }) => d)
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    await makeCourseRepository().updateCourse(data.id, data.course);
  });

export const deleteCourseFn = createServerFn({ method: "POST" })
  .validator((d: { token: string; id: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    await makeCourseRepository().deleteCourse(data.id);
  });

export const createLessonFn = createServerFn({ method: "POST" })
  .validator((d: { token: string; lesson: NewLesson }) => d)
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    return makeCourseRepository().createLesson(data.lesson);
  });

export const updateLessonFn = createServerFn({ method: "POST" })
  .validator((d: { token: string; id: string; lesson: Omit<NewLesson, "courseId"> }) => d)
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    await makeCourseRepository().updateLesson(data.id, data.lesson);
  });

export const deleteLessonFn = createServerFn({ method: "POST" })
  .validator((d: { token: string; id: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    await makeCourseRepository().deleteLesson(data.id);
  });

// ───────────────────────── events ─────────────────────────
export const listEventsAdminFn = createServerFn({ method: "GET" })
  .validator((d: { token: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    return makeEventRepository().listAll();
  });

export const createEventFn = createServerFn({ method: "POST" })
  .validator((d: { token: string; event: EventInput }) => d)
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    const { startsAt, ...rest } = data.event;
    return makeEventRepository().create({ ...rest, startsAt: new Date(startsAt) });
  });

export const updateEventFn = createServerFn({ method: "POST" })
  .validator((d: { token: string; id: string; event: EventInput }) => d)
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    const { startsAt, ...rest } = data.event;
    await makeEventRepository().update(data.id, { ...rest, startsAt: new Date(startsAt) });
  });

export const deleteEventFn = createServerFn({ method: "POST" })
  .validator((d: { token: string; id: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    await makeEventRepository().delete(data.id);
  });

// ───────────────────────── updates ─────────────────────────
export const createUpdateFn = createServerFn({ method: "POST" })
  .validator((d: { token: string; update: UpdateInput }) => d)
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    const { publishedAt, ...rest } = data.update;
    return makeUpdateRepository().create({ ...rest, publishedAt: new Date(publishedAt) });
  });

export const updateUpdateFn = createServerFn({ method: "POST" })
  .validator((d: { token: string; id: string; update: UpdateInput }) => d)
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    const { publishedAt, ...rest } = data.update;
    await makeUpdateRepository().update(data.id, { ...rest, publishedAt: new Date(publishedAt) });
  });

export const deleteUpdateFn = createServerFn({ method: "POST" })
  .validator((d: { token: string; id: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    await makeUpdateRepository().delete(data.id);
  });

// ───────────────────────── materials ─────────────────────────
export const createMaterialFn = createServerFn({ method: "POST" })
  .validator((d: { token: string; material: NewMaterial }) => d)
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    return makeMaterialRepository().create(data.material);
  });

export const updateMaterialFn = createServerFn({ method: "POST" })
  .validator((d: { token: string; id: string; material: Omit<NewMaterial, "lessonId"> }) => d)
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    await makeMaterialRepository().update(data.id, data.material);
  });

export const deleteMaterialFn = createServerFn({ method: "POST" })
  .validator((d: { token: string; id: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    await makeMaterialRepository().delete(data.id);
  });
