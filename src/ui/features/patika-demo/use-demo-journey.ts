import { useCallback, useEffect, useMemo, useState } from "react";
import { BADGES, DAYS, TOTAL_DAYS, type DemoBadge } from "./lib/mock-journey";

const KEY = "patika-demo-v1";
const keyOf = (day: number, taskId: string) => `${day}:${taskId}`;

interface Persisted {
  currentDay: number;
  completed: string[];
  badges: string[];
}

const FRESH: Persisted = { currentDay: 1, completed: [], badges: [] };

function load(): Persisted {
  if (typeof window === "undefined") return FRESH;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...FRESH, ...(JSON.parse(raw) as Partial<Persisted>) } : FRESH;
  } catch {
    return FRESH;
  }
}

/** Demo-only journey state (mock + localStorage). No backend. */
export function useDemoJourney() {
  const [state, setState] = useState<Persisted>(FRESH);

  // Hydrate from localStorage on the client (keeps SSR markup === first render).
  useEffect(() => setState(load()), []);
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  const completed = useMemo(() => new Set(state.completed), [state.completed]);

  const isTaskDone = useCallback(
    (day: number, id: string) => completed.has(keyOf(day, id)),
    [completed],
  );
  const isDayComplete = useCallback(
    (day: number) => (DAYS[day - 1]?.tasks ?? []).every((t) => completed.has(keyOf(day, t.id))),
    [completed],
  );

  const toggleTask = useCallback(
    (day: number, id: string) => {
      if (day !== state.currentDay) return; // only today is editable
      const k = keyOf(day, id);
      setState((s) => ({
        ...s,
        completed: s.completed.includes(k)
          ? s.completed.filter((x) => x !== k)
          : [...s.completed, k],
      }));
    },
    [state.currentDay],
  );

  const completeDay = useCallback((): DemoBadge | null => {
    const day = state.currentDay;
    if (!isDayComplete(day)) return null;
    const badge = BADGES.find((b) => b.day === day) ?? null;
    setState((s) => ({
      ...s,
      currentDay: Math.min(TOTAL_DAYS + 1, s.currentDay + 1),
      badges: badge && !s.badges.includes(badge.id) ? [...s.badges, badge.id] : s.badges,
    }));
    return badge;
  }, [state.currentDay, isDayComplete]);

  const reset = useCallback(() => setState(FRESH), []);

  return {
    total: TOTAL_DAYS,
    currentDay: state.currentDay,
    finished: state.currentDay > TOTAL_DAYS,
    streak: state.currentDay - 1,
    points: state.completed.length * 10,
    earnedBadges: state.badges,
    isTaskDone,
    isDayComplete,
    toggleTask,
    completeDay,
    reset,
  };
}
