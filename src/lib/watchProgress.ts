/**
 * Per-user "continue watching" progress, persisted in localStorage.
 * Client-only and SSR-safe (guards `window`). Read inside effects to avoid
 * hydration mismatches. No backend — this stays local even after Supabase.
 */
export interface WatchProgress {
  courseId: string;
  courseTitle: string;
  lessonId: string;
  lessonTitle: string;
  lessonOrder: number;
  currentTime: number;
  updatedAt: number;
}

const key = (userId: string) => `530:watch-progress:${userId}`;

export function getProgress(userId: string): WatchProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key(userId));
    return raw ? (JSON.parse(raw) as WatchProgress) : null;
  } catch {
    return null;
  }
}

export function setProgress(userId: string, progress: WatchProgress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      key(userId),
      JSON.stringify({ ...progress, updatedAt: Date.now() }),
    );
  } catch {
    /* storage full or unavailable — progress is best-effort */
  }
}
