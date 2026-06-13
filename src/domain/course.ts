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
  isPublished: boolean;
}

export interface CourseWithLessons extends Course {
  lessons: Lesson[];
}

export interface NewCourse {
  title: string;
  description: string | null;
  coverImage: string | null;
  orderIndex: number;
  isPublished: boolean;
}

export interface NewLesson {
  courseId: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  durationMinutes: number | null;
  orderIndex: number;
}

export class CourseNotFoundError extends Error {
  constructor(id: string) {
    super(`Course not found: ${id}`);
    this.name = "CourseNotFoundError";
  }
}

/** Port: read + admin write access to course content. */
export interface CourseRepository {
  /** Published courses with their lessons, ordered by `orderIndex`. */
  listPublishedWithLessons(): Promise<CourseWithLessons[]>;
  /** ALL courses (incl. unpublished) with lessons — admin. */
  listAllWithLessons(): Promise<CourseWithLessons[]>;
  /** A single published course with lessons. Throws {@link CourseNotFoundError}. */
  getByIdWithLessons(id: string): Promise<CourseWithLessons>;

  createCourse(input: NewCourse): Promise<Course>;
  updateCourse(id: string, input: NewCourse): Promise<void>;
  deleteCourse(id: string): Promise<void>;

  createLesson(input: NewLesson): Promise<Lesson>;
  updateLesson(id: string, input: Omit<NewLesson, "courseId">): Promise<void>;
  deleteLesson(id: string): Promise<void>;
}
