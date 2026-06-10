import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Eyebrow, Heading, Card } from "@/ui/design-system";
import type { LessonNoteWithTitle } from "@/domain/learning";
import { useAuth } from "@/ui/shared/auth/auth-context";
import { deleteNoteFn, listAllNotesFn } from "@/server/learning";

export function NotesPage() {
  const { auth } = useAuth();
  const [notes, setNotes] = useState<LessonNoteWithTitle[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await auth.getAccessToken();
      if (!token) return;
      const ns = await listAllNotesFn({ data: { token } });
      if (!cancelled) {
        setNotes(ns);
        setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [auth]);

  async function remove(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    const token = await auth.getAccessToken();
    if (token) await deleteNoteFn({ data: { token, noteId: id } });
  }

  return (
    <div className="animate-rise mx-auto max-w-2xl">
      <Eyebrow size="sm">benim odam · notlar</Eyebrow>
      <Heading as="h1" size="xl" className="mt-6">
        Notlarım
      </Heading>

      {loaded && notes.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground/70">Henüz not almadın.</p>
      ) : (
        <div className="mt-8 space-y-3">
          {notes.map((n) => (
            <Card key={n.id} variant="subtle" className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    to="/uye/dersler/$courseId"
                    params={{ courseId: n.courseId }}
                    search={{ lesson: n.lessonId }}
                    className="font-display text-sm text-cream underline-offset-4 hover:underline"
                  >
                    {n.lessonTitle}
                  </Link>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-cream/85">
                    {n.content}
                  </p>
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">
                    {format(new Date(n.createdAt), "d MMM yyyy", { locale: tr })}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(n.id)}
                  aria-label="notu sil"
                  className="shrink-0 text-muted-foreground/40 transition-colors hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
