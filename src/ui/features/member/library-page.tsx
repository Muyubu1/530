import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Eyebrow, Heading, MediaCard } from "@/ui/design-system";
import type { SavedLessonItem } from "@/domain/learning";
import { useAuth } from "@/ui/shared/auth/auth-context";
import { listAllNotesFn, listSavedLessonsFn } from "@/server/learning";

/** Personal collection — saved lessons + a notes summary. */
export function LibraryPage() {
  const { auth } = useAuth();
  const [saved, setSaved] = useState<SavedLessonItem[]>([]);
  const [noteCount, setNoteCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await auth.getAccessToken();
        if (!token) return;
        const [savedList, notes] = await Promise.all([
          listSavedLessonsFn({ data: { token } }),
          listAllNotesFn({ data: { token } }),
        ]);
        if (cancelled) return;
        setSaved(savedList);
        setNoteCount(notes.length);
      } catch {
        /* leave empty */
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [auth]);

  return (
    <div className="animate-rise mx-auto max-w-2xl">
      <Eyebrow size="sm">kütüphane</Eyebrow>
      <Heading as="h1" size="xl" className="mt-6">
        Kişisel koleksiyonun
      </Heading>

      <Link
        to="/uye/profil/notlar"
        className="mt-8 block rounded-xl border border-border/40 bg-card/30 p-5 transition-colors hover:border-cream/40"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cream">
          notların · {noteCount}
        </p>
        <p className="mt-1 text-xs text-muted-foreground/70">Tüm notlarını gör →</p>
      </Link>

      <p className="mb-3 mt-10 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60">
        kaydettiğin dersler
      </p>
      {loaded && saved.length === 0 ? (
        <p className="text-sm text-muted-foreground/70">Henüz ders kaydetmedin.</p>
      ) : (
        <div className="space-y-4">
          {saved.map((it) => (
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
