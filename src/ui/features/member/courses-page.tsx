import { Link } from "@tanstack/react-router";
import { Heading, Card, LessonThumb } from "@/ui/design-system";
import type { CourseWithLessons } from "@/domain/course";

/** "Programlarım": each course as a cover card + a horizontal lessons carousel. */
export function CoursesPage({ courses }: { courses: CourseWithLessons[] }) {
  return (
    <div className="animate-rise">
      <Heading as="h1" size="xl">
        Programlarım
      </Heading>

      {courses.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground/70">Henüz bir program yok.</p>
      ) : (
        <div className="mt-10 space-y-16">
          {courses.map((course, i) => (
            <section key={course.id}>
              <Link
                to="/uye/dersler/$courseId"
                params={{ courseId: course.id }}
                className="group block"
              >
                <Card className="relative overflow-hidden border-cream/10">
                  <div className="relative flex aspect-[16/7] w-full flex-col justify-end overflow-hidden bg-[oklch(0.14_0_0)] p-6 md:p-8">
                    {course.coverImage && (
                      <img
                        src={course.coverImage}
                        alt={course.title}
                        className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <span className="absolute right-5 top-5 font-display text-5xl font-semibold text-cream/10 md:text-7xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="relative">
                      <h2 className="font-display text-xl font-semibold tracking-tight text-cream md:text-2xl">
                        {course.title}
                      </h2>
                      {course.description && (
                        <p className="mt-2 line-clamp-2 max-w-xl text-xs leading-relaxed text-muted-foreground/80 md:text-sm">
                          {course.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>

              <p className="mb-3 mt-5 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60">
                Dersler
              </p>
              <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {course.lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    to="/uye/dersler/$courseId"
                    params={{ courseId: course.id }}
                    search={{ lesson: lesson.id }}
                    className="block w-40 shrink-0 sm:w-48"
                  >
                    <LessonThumb
                      order={lesson.orderIndex + 1}
                      title={lesson.title}
                      thumbnailUrl={lesson.thumbnailUrl}
                      durationMinutes={lesson.durationMinutes}
                    />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
