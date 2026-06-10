import { sql } from "../db/client.server";
import {
  CourseNotFoundError,
  type Course,
  type CourseRepository,
  type CourseWithLessons,
  type Lesson,
} from "@/domain/course";

interface CourseRow {
  id: string;
  title: string;
  description: string | null;
  cover_image: string | null;
  order_index: number;
}

interface LessonRow {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  duration_minutes: number | null;
  order_index: number;
}

const toCourse = (r: CourseRow): Course => ({
  id: r.id,
  title: r.title,
  description: r.description,
  coverImage: r.cover_image,
  orderIndex: r.order_index,
});

const toLesson = (r: LessonRow): Lesson => ({
  id: r.id,
  courseId: r.course_id,
  title: r.title,
  description: r.description,
  videoUrl: r.video_url,
  thumbnailUrl: r.thumbnail_url,
  durationMinutes: r.duration_minutes,
  orderIndex: r.order_index,
});

const COURSE_COLS = sql`id, title, description, cover_image, order_index`;
const LESSON_COLS = sql`id, course_id, title, description, video_url, thumbnail_url, duration_minutes, order_index`;

/** Postgres adapter for {@link CourseRepository}. */
export function makeCourseRepository(): CourseRepository {
  return {
    async listPublishedWithLessons(): Promise<CourseWithLessons[]> {
      const courses = await sql<CourseRow[]>`
        select ${COURSE_COLS} from courses where is_published = true order by order_index
      `;
      if (courses.length === 0) return [];

      const ids = courses.map((c) => c.id);
      const lessons = await sql<LessonRow[]>`
        select ${LESSON_COLS} from lessons where course_id in ${sql(ids)} order by order_index
      `;

      const byCourse = new Map<string, Lesson[]>();
      for (const row of lessons) {
        const list = byCourse.get(row.course_id) ?? [];
        list.push(toLesson(row));
        byCourse.set(row.course_id, list);
      }

      return courses.map((c) => ({ ...toCourse(c), lessons: byCourse.get(c.id) ?? [] }));
    },

    async getByIdWithLessons(id: string): Promise<CourseWithLessons> {
      const [course] = await sql<CourseRow[]>`
        select ${COURSE_COLS} from courses where id = ${id} and is_published = true
      `;
      if (!course) throw new CourseNotFoundError(id);

      const lessons = await sql<LessonRow[]>`
        select ${LESSON_COLS} from lessons where course_id = ${id} order by order_index
      `;
      return { ...toCourse(course), lessons: lessons.map(toLesson) };
    },
  };
}
