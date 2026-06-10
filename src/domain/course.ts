/**
 * Course / lesson domain — entities and the repository port.
 * No framework, no Postgres. Infrastructure adapters implement the port.
 */

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  durationMinutes: number | null;
  orderIndex: number;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  orderIndex: number;
}

export interface CourseWithLessons extends Course {
  lessons: Lesson[];
}

export class CourseNotFoundError extends Error {
  constructor(id: string) {
    super(`Course not found: ${id}`);
    this.name = "CourseNotFoundError";
  }
}

/** Port: read access to published course content. */
export interface CourseRepository {
  /** Published courses with their lessons, ordered by `orderIndex`. */
  listPublishedWithLessons(): Promise<CourseWithLessons[]>;
  /** A single published course with lessons. Throws {@link CourseNotFoundError}. */
  getByIdWithLessons(id: string): Promise<CourseWithLessons>;
}
