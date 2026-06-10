import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Eyebrow, Heading, GradientText, MediaCard, EventCard, GlowHalo } from "@/ui/design-system";
import type { AuthUser } from "@/domain/auth";
import type { CourseWithLessons } from "@/domain/course";
import type { EventItem } from "@/domain/event";
import { getProgress, type WatchProgress } from "@/lib/watchProgress";
import { whenLine } from "./event-format";

function eventDetails(e: EventItem): string[] {
  return [whenLine(e.startsAt), ...(e.location ? [`Konum: ${e.location}`] : [])];
}

/** Member home: greeting, continue/start card, upcoming events. */
export function MemberDashboard({
  user,
  courses,
  events,
}: {
  user: AuthUser;
  courses: CourseWithLessons[];
  events: EventItem[];
}) {
  const [progress, setProgress] = useState<WatchProgress | null>(null);
  useEffect(() => setProgress(getProgress(user.id)), [user.id]);

  const firstCourse = courses[0];
  const firstLesson = firstCourse?.lessons[0];

  return (
    <div className="animate-rise mx-auto max-w-xl">
      <Eyebrow size="sm">üye alanı · 05:30</Eyebrow>
      <Heading as="h1" size="xl" className="mt-8">
        Hoş geldin
        {user.displayName ? (
          <>
            , <GradientText>{user.displayName}.</GradientText>
          </>
        ) : (
          "."
        )}
      </Heading>
      <p className="mt-6 max-w-sm text-xs leading-relaxed text-muted-foreground/70">
        Yolculuğun bugünkü adımı seni bekliyor.
      </p>

      {progress ? (
        <ContinueCard
          courseId={progress.courseId}
          lessonId={progress.lessonId}
          t={Math.max(0, Math.floor(progress.currentTime) - 2)}
          title={progress.lessonTitle}
          ctaLabel="izlemeye devam et"
        />
      ) : firstCourse && firstLesson ? (
        <ContinueCard
          courseId={firstCourse.id}
          lessonId={firstLesson.id}
          title={firstLesson.title}
          thumbnail={firstLesson.thumbnailUrl}
          ctaLabel="başla"
        />
      ) : null}

      <section className="mt-16 sm:mt-20">
        <Heading size="md">Yaklaşan Etkinlikler</Heading>
        <div className="mt-6 grid gap-4">
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground/70">Şimdilik etkinlik yok.</p>
          ) : (
            events
              .slice(0, 2)
              .map((e) => (
                <EventCard
                  key={e.id}
                  title={e.title}
                  details={eventDetails(e)}
                  actionLabel={e.link ? "detay" : "yakında"}
                />
              ))
          )}
        </div>
      </section>
    </div>
  );
}

function ContinueCard(props: {
  courseId: string;
  lessonId: string;
  t?: number;
  title: string;
  thumbnail?: string | null;
  ctaLabel: string;
}) {
  return (
    <div className="relative mt-12">
      <GlowHalo />
      <Link
        to="/uye/dersler/$courseId"
        params={{ courseId: props.courseId }}
        search={{ lesson: props.lessonId, t: props.t }}
        className="relative z-10 block"
      >
        <MediaCard thumbnail={props.thumbnail} title={props.title} ctaLabel={props.ctaLabel} />
      </Link>
    </div>
  );
}
