import type { CourseRepository, CourseWithLessons } from "@/domain/course";

/** Use-case: list published courses with their lessons. */
export function listCourses(repo: CourseRepository): Promise<CourseWithLessons[]> {
  return repo.listPublishedWithLessons();
}
