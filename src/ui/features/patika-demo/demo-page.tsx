import { useCallback, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Eyebrow, Heading } from "@/ui/design-system";
import { useDemoJourney } from "./use-demo-journey";
import { StatBar } from "./components/stat-bar";
import { JourneyMap } from "./components/journey-map";
import { BadgeShelf } from "./components/badge-shelf";
import { RewardModal } from "./components/reward-modal";
import { DayComplete } from "./components/day-complete";
import { DayModal } from "./components/day-modal";
import type { DemoBadge } from "./lib/mock-journey";

export function PatikaDemoPage() {
  const j = useDemoJourney();
  const [reward, setReward] = useState<DemoBadge | null>(null);
  const [celebrate, setCelebrate] = useState<{
    day: number;
    streak: number;
    points: number;
  } | null>(null);
  const pendingReward = useRef<DemoBadge | null>(null);
  const [openDay, setOpenDay] = useState<number | null>(null);

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
    <div className="min-h-screen bg-background text-foreground">
      <div className="animate-rise mx-auto max-w-xl px-5 pb-24 pt-8">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            aria-label="geri"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-cream transition-colors hover:border-cream"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/40">
            demo · gerçek veriye bağlı değil
          </span>
          <button
            type="button"
            onClick={j.reset}
            aria-label="sıfırla"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground/70 transition-colors hover:border-cream hover:text-cream"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        <Eyebrow rule="top" tone="cream" className="mt-8 justify-center">
          28 günlük patika
        </Eyebrow>
        <Heading as="h1" size="xl" className="mt-5 text-center">
          Dönüşüm Yolculuğu
        </Heading>

        <div className="mt-8">
          <StatBar currentDay={j.currentDay} total={j.total} streak={j.streak} points={j.points} />
        </div>

        <div className="mt-10">
          <JourneyMap currentDay={j.currentDay} onPickDay={(day) => setOpenDay(day)} />
        </div>

        {j.finished && (
          <div className="mt-12 rounded-2xl border border-cream/15 bg-card/30 p-8 text-center">
            <Eyebrow size="sm" tone="cream" className="justify-center">
              patika · tamamlandı
            </Eyebrow>
            <Heading as="h2" size="lg" className="mt-4">
              28 gün. Bitti.
            </Heading>
            <p className="mt-3 text-sm text-muted-foreground/70">
              Dönüşüm tamamlandı. Yeni bir döngü seni bekliyor.
            </p>
          </div>
        )}

        <div className="mt-14">
          <BadgeShelf earned={j.earnedBadges} />
        </div>
      </div>

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
