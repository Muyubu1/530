import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/ui/shared/auth/auth-context";
import type { LessonNote } from "@/domain/learning";
import {
  addNoteFn,
  deleteNoteFn,
  listLessonStateFn,
  listNotesForLessonFn,
  toggleCompletionFn,
  toggleSavedFn,
} from "@/server/learning";

const withToggled = (set: Set<string>, id: string, on: boolean) => {
  const next = new Set(set);
  if (on) next.add(id);
  else next.delete(id);
  return next;
};

/** Client-side user state for a course: completion, saved, and per-lesson notes. */
export function useLessonState(courseId: string, activeLessonId: string | undefined) {
  const { auth } = useAuth();
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<LessonNote[]>([]);

  const requireToken = useCallback(async () => {
    const token = await auth.getAccessToken();
    if (!token) throw new Error("Oturum bulunamadı.");
    return token;
  }, [auth]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await auth.getAccessToken();
        if (!token) return;
        const state = await listLessonStateFn({ data: { token } });
        if (cancelled) return;
        setCompletedIds(new Set(state.completedIds));
        setSavedIds(new Set(state.savedIds));
      } catch {
        /* not signed in yet / transient — leave empty */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId, auth]);

  useEffect(() => {
    let cancelled = false;
    if (!activeLessonId) {
      setNotes([]);
      return;
    }
    (async () => {
      try {
        const token = await auth.getAccessToken();
        if (!token) return;
        const ns = await listNotesForLessonFn({ data: { token, lessonId: activeLessonId } });
        if (!cancelled) setNotes(ns);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeLessonId, auth]);

  const toggleComplete = useCallback(
    async (lessonId: string) => {
      const done = !completedIds.has(lessonId);
      setCompletedIds((s) => withToggled(s, lessonId, done));
      try {
        await toggleCompletionFn({ data: { token: await requireToken(), lessonId, done } });
      } catch {
        setCompletedIds((s) => withToggled(s, lessonId, !done));
        toast.error("Kaydedilemedi.");
      }
    },
    [completedIds, requireToken],
  );

  const toggleSaved = useCallback(
    async (lessonId: string) => {
      const saved = !savedIds.has(lessonId);
      setSavedIds((s) => withToggled(s, lessonId, saved));
      try {
        await toggleSavedFn({ data: { token: await requireToken(), lessonId, saved } });
        toast.success(saved ? "Odana eklendi." : "Kayıttan kaldırıldı.");
      } catch {
        setSavedIds((s) => withToggled(s, lessonId, !saved));
        toast.error("Kaydedilemedi.");
      }
    },
    [savedIds, requireToken],
  );

  const addNote = useCallback(
    async (lessonId: string, content: string): Promise<boolean> => {
      try {
        const note = await addNoteFn({ data: { token: await requireToken(), lessonId, content } });
        setNotes((prev) => [note, ...prev]);
        toast.success("Not kaydedildi.");
        return true;
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Not kaydedilemedi.");
        return false;
      }
    },
    [requireToken],
  );

  const removeNote = useCallback(
    async (noteId: string) => {
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      try {
        await deleteNoteFn({ data: { token: await requireToken(), noteId } });
      } catch {
        toast.error("Silinemedi.");
      }
    },
    [requireToken],
  );

  return { completedIds, savedIds, notes, toggleComplete, toggleSaved, addNote, removeNote };
}
