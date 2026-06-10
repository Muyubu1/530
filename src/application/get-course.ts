import type { CourseRepository, CourseWithLessons } from "@/domain/course";

/** Use-case: fetch a single course with lessons. Throws `CourseNotFoundError`. */
export function getCourse(repo: CourseRepository, id: string): Promise<CourseWithLessons> {
  return repo.getByIdWithLessons(id);
}
