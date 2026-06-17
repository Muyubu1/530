import { useCallback, useRef, useState } from "react";
import { Eyebrow } from "@/ui/design-system";
import { useDemoJourney } from "./use-demo-journey";
import { JourneyHero } from "./components/journey-hero";
import { DayStrip } from "./components/day-strip";
import { RewardCard } from "./components/reward-card";
import { BadgeShelf } from "./components/badge-shelf";
import { RewardModal } from "./components/reward-modal";
import { DayComplete } from "./components/day-complete";
import { DayModal } from "./components/day-modal";
import { BADGES, type DemoBadge } from "./lib/mock-journey";

/**
 * The 28-day journey experience — shell-less and self-contained (owns its state
 * via {@link useDemoJourney}). Rendered inside the member area (`/uye/patika`,
 * wrapped by MemberLayout) and the standalone demo (`/patika-demo`). Persistence is
 * localStorage for now; a per-user Supabase backend swaps in behind the same hook later.
 * Mobile-first throughout.
 */
export function PatikaJourney() {
  const j = useDemoJourney();
  const [reward, setReward] = useState<DemoBadge | null>(null);
  const [celebrate, setCelebrate] = useState<{
    day: number;
    streak: number;
    points: number;
  } | null>(null);
  const pendingReward = useRef<DemoBadge | null>(null);
  const [openDay, setOpenDay] = useState<number | null>(null);

  const completedDays = Math.min(Math.max(j.currentDay - 1, 0), j.total);
  const pct = Math.round((completedDays / j.total) * 100);

  function handleCompleteDay() {
    const day = j.currentDay;
    pendingReward.current = j.completeDay();
    setCelebrate({ day, streak: day, points: 30 });
  }

  function completeFromModal() {
    setOpenDay(null);
    handleCompleteDay();
  }

  const finishCelebration = useCallback(() => {
    setCelebrate(null);
    const badge = pendingReward.current;
    pendingReward.current = null;
    if (badge) setReward(badge);
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-12 md:space-y-16">
      <JourneyHero
        currentDay={j.currentDay}
        total={j.total}
        completedDays={completedDays}
        pct={pct}
        streak={j.streak}
        finished={j.finished}
        onFocusToday={() => !j.finished && setOpenDay(j.currentDay)}
      />

      <div>
        <Eyebrow size="md" tone="cream" className="px-1">
          yolculuk
        </Eyebrow>
        <div className="mt-5">
          <DayStrip currentDay={j.currentDay} onPickDay={(day) => setOpenDay(day)} />
        </div>
      </div>

      <RewardCard
        unlocked={j.finished}
        onOpen={() => setReward(BADGES[BADGES.length - 1] ?? null)}
      />

      <BadgeShelf earned={j.earnedBadges} />

      <p className="border-t border-cream/10 pt-10 text-center font-mono text-[11px] uppercase leading-relaxed tracking-[0.3em] text-muted-foreground/45">
        “Disiplin, her gün küçük zaferlerle inşa edilir.”
      </p>

      {celebrate && (
        <DayComplete
          day={celebrate.day}
          streak={celebrate.streak}
          points={celebrate.points}
          onDone={finishCelebration}
        />
      )}

      {openDay != null && (
        <DayModal
          day={openDay}
          editable={openDay === j.currentDay}
          isTaskDone={j.isTaskDone}
          isDayComplete={j.isDayComplete}
          onToggle={j.toggleTask}
          onCompleteDay={completeFromModal}
          onClose={() => setOpenDay(null)}
        />
      )}

      <RewardModal badge={reward} onClose={() => setReward(null)} />
    </div>
  );
}
