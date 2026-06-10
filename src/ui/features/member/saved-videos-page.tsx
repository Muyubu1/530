import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Eyebrow, Heading, MediaCard } from "@/ui/design-system";
import type { SavedLessonItem } from "@/domain/learning";
import { useAuth } from "@/ui/shared/auth/auth-context";
import { listSavedLessonsFn } from "@/server/learning";

export function SavedVideosPage() {
  const { auth } = useAuth();
  const [items, setItems] = useState<SavedLessonItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await auth.getAccessToken();
      if (!token) return;
      const list = await listSavedLessonsFn({ data: { token } });
      if (!cancelled) {
        setItems(list);
        setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [auth]);

  return (
    <div className="animate-rise mx-auto max-w-2xl">
      <Eyebrow size="sm">benim odam · videolar</Eyebrow>
      <Heading as="h1" size="xl" className="mt-6">
        Kaydettiklerim
      </Heading>

      {loaded && items.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground/70">Henüz video kaydetmedin.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((it) => (
            <Link
              key={it.lessonId}
              to="/uye/dersler/$courseId"
              params={{ courseId: it.courseId }}
              search={{ lesson: it.lessonId }}
              className="block"
            >
              <MediaCard thumbnail={it.thumbnailUrl} title={it.title} ctaLabel="izle" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
