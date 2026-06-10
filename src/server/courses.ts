import { createServerFn } from "@tanstack/react-start";
import { listCourses } from "@/application/list-courses";
import { getCourse } from "@/application/get-course";
import { makeCourseRepository } from "@/infrastructure/course/postgres-course-repository.server";
import { CourseNotFoundError, type CourseWithLessons } from "@/domain/course";

/** Composition root: wires the Postgres course adapter into the read use-cases. */
export const listCoursesFn = createServerFn({ method: "GET" }).handler(() =>
  listCourses(makeCourseRepository()),
);

/** Returns null (not a thrown error) on not-found so the loader can map it to a 404. */
export const getCourseFn = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data }): Promise<CourseWithLessons | null> => {
    try {
      return await getCourse(makeCourseRepository(), data);
    } catch (err) {
      if (err instanceof CourseNotFoundError) return null;
      // Malformed UUID (Postgres invalid_text_representation) → treat as not-found.
      if (err && typeof err === "object" && "code" in err && err.code === "22P02") return null;
      throw err;
    }
  });
