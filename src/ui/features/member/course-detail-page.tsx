import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Bookmark, BookmarkCheck, Check, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CinematicVideoFrame, LessonThumb, Button } from "@/ui/design-system";
import type { CourseWithLessons } from "@/domain/course";
import type { LessonNote } from "@/domain/learning";
import { useAuth } from "@/ui/shared/auth/auth-context";
import { setProgress } from "@/lib/watchProgress";
import { useLessonState } from "./use-lesson-state";
import { MaterialsPanel } from "./materials-panel";
import { cn } from "@/lib/utils";

/** Course detail: player + lesson switcher + completion / saved / notes. */
export function CourseDetailPage({
  course,
  activeLessonId,
  startAt,
}: {
  course: CourseWithLessons;
  activeLessonId?: string;
  startAt?: number;
}) {
  const { user } = useAuth();
  const lessons = course.lessons;
  const active = lessons.find((l) => l.id === activeLessonId) ?? lessons[0];
  const activeIndex = active ? lessons.findIndex((l) => l.id === active.id) : -1;
  const next = activeIndex >= 0 ? lessons[activeIndex + 1] : undefined;

  const { completedIds, savedIds, notes, toggleComplete, toggleSaved, addNote, removeNote } =
    useLessonState(course.id, active?.id);

  const lastSavedRef = useRef(0);
  function handleTimeUpdate(sec: number) {
    if (!user || !active) return;
    const now = Math.floor(sec);
    if (now === lastSavedRef.current || now % 5 !== 0) return;
    lastSavedRef.current = now;
    setProgress(user.id, {
      courseId: course.id,
      courseTitle: course.title,
      lessonId: active.id,
      lessonTitle: active.title,
      lessonOrder: active.orderIndex,
      currentTime: sec,
      updatedAt: Date.now(),
    });
  }

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
              startAt={startAt}
              onTimeUpdate={handleTimeUpdate}
              topRightSlot={
                <button
                  type="button"
                  onClick={() => toggleSaved(active.id)}
                  aria-label={savedIds.has(active.id) ? "kayıttan kaldır" : "videoyu kaydet"}
                  className="flex items-center gap-2 rounded-full border border-cream/40 bg-background/70 px-2.5 py-2 text-cream backdrop-blur-md transition-all hover:border-cream hover:bg-background/85"
                >
                  {savedIds.has(active.id) ? (
                    <BookmarkCheck className="h-4 w-4 fill-cream/30" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </button>
              }
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

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleComplete(active.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-md border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.25em] transition-colors",
                    completedIds.has(active.id)
                      ? "border-cream bg-cream/10 text-cream"
                      : "border-cream/40 text-cream/80 hover:border-cream hover:text-cream",
                  )}
                >
                  <Check className="h-3.5 w-3.5" />
                  {completedIds.has(active.id) ? "tamamlandı" : "tamamla"}
                </button>
                {next && (
                  <Link
                    to="/uye/dersler/$courseId"
                    params={{ courseId: course.id }}
                    search={{ lesson: next.id }}
                    className="inline-flex items-center gap-2 rounded-md border border-cream/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cream transition-colors hover:border-cream hover:bg-cream/10"
                  >
                    sonraki bölüm
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>

              <MaterialsPanel lessonId={active.id} />

              <NotesPanel
                notes={notes}
                onAdd={(content) => addNote(active.id, content)}
                onRemove={removeNote}
              />
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
                    completed={completedIds.has(lesson.id)}
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

function NotesPanel({
  notes,
  onAdd,
  onRemove,
}: {
  notes: LessonNote[];
  onAdd: (content: string) => Promise<boolean>;
  onRemove: (id: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!draft.trim()) return;
    setSaving(true);
    const ok = await onAdd(draft);
    setSaving(false);
    if (ok) setDraft("");
  }

  return (
    <div className="mt-10 rounded-xl border border-border/40 bg-card/30 p-4 sm:p-5">
      <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">
        not al
      </p>
      <textarea
        rows={2}
        maxLength={2000}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Bu ders için bir not bırak…"
        className="mt-3 w-full resize-none rounded-md border border-border/60 bg-transparent px-3 py-2 text-sm text-cream placeholder:text-muted-foreground/40 focus:border-cream focus:outline-none"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="font-mono text-[9px] text-muted-foreground/50">{draft.length}/2000</span>
        <Button size="sm" variant="cream" onClick={save} disabled={saving || !draft.trim()}>
          {saving ? "kaydediliyor…" : "notu kaydet"}
        </Button>
      </div>

      {notes.length > 0 && (
        <div className="mt-5 space-y-3 border-t border-border/40 pt-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">
            önceki notların · {notes.length}
          </p>
          {notes.map((note) => (
            <div key={note.id} className="group flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-cream/90">
                  {note.content}
                </p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">
                  {format(new Date(note.createdAt), "d MMM yyyy", { locale: tr })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(note.id)}
                aria-label="notu sil"
                className="shrink-0 text-muted-foreground/40 transition-colors hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
