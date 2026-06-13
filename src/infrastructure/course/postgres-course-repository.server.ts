import { sql } from "../db/client.server";
import {
  CourseNotFoundError,
  type Course,
  type CourseRepository,
  type CourseWithLessons,
  type Lesson,
  type NewCourse,
  type NewLesson,
} from "@/domain/course";

interface CourseRow {
  id: string;
  title: string;
  description: string | null;
  cover_image: string | null;
  order_index: number;
  is_published: boolean;
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
  isPublished: r.is_published,
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

const COURSE_COLS = sql`id, title, description, cover_image, order_index, is_published`;
const LESSON_COLS = sql`id, course_id, title, description, video_url, thumbnail_url, duration_minutes, order_index`;

async function attachLessons(courses: CourseRow[]): Promise<CourseWithLessons[]> {
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
}

/** Postgres adapter for {@link CourseRepository}. */
export function makeCourseRepository(): CourseRepository {
  return {
    async listPublishedWithLessons() {
      const courses = await sql<CourseRow[]>`
        select ${COURSE_COLS} from courses where is_published = true order by order_index
      `;
      return attachLessons(courses);
    },

    async listAllWithLessons() {
      const courses = await sql<
        CourseRow[]
      >`select ${COURSE_COLS} from courses order by order_index`;
      return attachLessons(courses);
    },

    async getByIdWithLessons(id) {
      const [course] = await sql<CourseRow[]>`
        select ${COURSE_COLS} from courses where id = ${id} and is_published = true
      `;
      if (!course) throw new CourseNotFoundError(id);
      const lessons = await sql<LessonRow[]>`
        select ${LESSON_COLS} from lessons where course_id = ${id} order by order_index
      `;
      return { ...toCourse(course), lessons: lessons.map(toLesson) };
    },

    async createCourse(input: NewCourse) {
      const [r] = await sql<CourseRow[]>`
        insert into courses (title, description, cover_image, order_index, is_published)
        values (${input.title}, ${input.description}, ${input.coverImage}, ${input.orderIndex}, ${input.isPublished})
        returning ${COURSE_COLS}
      `;
      return toCourse(r);
    },

    async updateCourse(id, input) {
      await sql`
        update courses set
          title = ${input.title}, description = ${input.description},
          cover_image = ${input.coverImage}, order_index = ${input.orderIndex},
          is_published = ${input.isPublished}
        where id = ${id}
      `;
    },

    async deleteCourse(id) {
      await sql`delete from courses where id = ${id}`;
    },

    async createLesson(input: NewLesson) {
      const [r] = await sql<LessonRow[]>`
        insert into lessons (course_id, title, description, video_url, thumbnail_url, duration_minutes, order_index)
        values (${input.courseId}, ${input.title}, ${input.description}, ${input.videoUrl}, ${input.thumbnailUrl}, ${input.durationMinutes}, ${input.orderIndex})
        returning ${LESSON_COLS}
      `;
      return toLesson(r);
    },

    async updateLesson(id, input) {
      await sql`
        update lessons set
          title = ${input.title}, description = ${input.description},
          video_url = ${input.videoUrl}, thumbnail_url = ${input.thumbnailUrl},
          duration_minutes = ${input.durationMinutes}, order_index = ${input.orderIndex}
        where id = ${id}
      `;
    },

    async deleteLesson(id) {
      await sql`delete from lessons where id = ${id}`;
    },
  };
}
