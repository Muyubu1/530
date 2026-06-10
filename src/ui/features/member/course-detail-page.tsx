import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CinematicVideoFrame, LessonThumb } from "@/ui/design-system";
import type { CourseWithLessons } from "@/domain/course";

/** Course detail: video player + lesson switcher. Read-only content (no notes/materials yet). */
export function CourseDetailPage({
  course,
  activeLessonId,
}: {
  course: CourseWithLessons;
  activeLessonId?: string;
}) {
  const lessons = course.lessons;
  const active = lessons.find((l) => l.id === activeLessonId) ?? lessons[0];
  const activeIndex = active ? lessons.findIndex((l) => l.id === active.id) : -1;
  const next = activeIndex >= 0 ? lessons[activeIndex + 1] : undefined;

  return (
    <div className="animate-rise">
      <Link
        to="/uye/dersler"
        className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 transition-colors hover:text-cream"
      >
        ← dersler
      </Link>
      <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-cream md:text-3xl">
        {course.title}
      </h1>

      {!active ? (
        <p className="mt-8 text-sm text-muted-foreground/70">Bu programda henüz ders yok.</p>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_18rem]">
          <div>
            <CinematicVideoFrame
              src={active.videoUrl ?? ""}
              poster={active.thumbnailUrl ?? undefined}
            />
            <div className="mt-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
                {String(active.orderIndex + 1).padStart(2, "0")}
                {active.durationMinutes != null && ` · ${active.durationMinutes} dk`}
              </p>
              <h2 className="mt-2 font-display text-lg font-medium tracking-tight text-cream md:text-xl">
                {active.title}
              </h2>
              {active.description && (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground/80">
                  {active.description}
                </p>
              )}
              {next && (
                <Link
                  to="/uye/dersler/$courseId"
                  params={{ courseId: course.id }}
                  search={{ lesson: next.id }}
                  className="mt-6 inline-flex items-center gap-2 rounded-md border border-cream/40 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-cream transition-colors hover:border-cream hover:bg-cream/10"
                >
                  sonraki bölüm
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>

          <aside>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60">
              dersler
            </p>
            <div className="grid gap-3">
              {lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  to="/uye/dersler/$courseId"
                  params={{ courseId: course.id }}
                  search={{ lesson: lesson.id }}
                  className="block"
                >
                  <LessonThumb
                    order={lesson.orderIndex + 1}
                    title={lesson.title}
                    thumbnailUrl={lesson.thumbnailUrl}
                    durationMinutes={lesson.durationMinutes}
                    active={lesson.id === active.id}
                  />
                </Link>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
