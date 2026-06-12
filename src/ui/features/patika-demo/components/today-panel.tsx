import { Eyebrow, Heading, Button } from "@/ui/design-system";
import { DAYS } from "../lib/mock-journey";
import { TaskRow } from "./task-row";

export function TodayPanel({
  currentDay,
  finished,
  isTaskDone,
  isDayComplete,
  onToggle,
  onCompleteDay,
}: {
  currentDay: number;
  finished: boolean;
  isTaskDone: (day: number, id: string) => boolean;
  isDayComplete: (day: number) => boolean;
  onToggle: (day: number, id: string) => void;
  onCompleteDay: () => void;
}) {
  if (finished) {
    return (
      <div id="bugun" className="rounded-2xl border border-cream/15 bg-card/30 p-8 text-center">
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
    );
  }

  const day = DAYS[currentDay - 1];
  const dayDone = isDayComplete(currentDay);

  return (
    <div id="bugun">
      <Eyebrow size="sm">patika · bugün</Eyebrow>
      <Heading as="h2" size="lg" className="mt-3">
        {currentDay}. Gün — {day.theme}
      </Heading>

      <div className="mt-6 space-y-3">
        {day.tasks.map((t) => (
          <TaskRow
            key={t.id}
            task={t}
            done={isTaskDone(currentDay, t.id)}
            editable
            onToggle={() => onToggle(currentDay, t.id)}
          />
        ))}
      </div>

      {dayDone && (
        <Button variant="cream" size="lg" className="mt-6 w-full" onClick={onCompleteDay}>
          Günü tamamla →
        </Button>
      )}
    </div>
  );
}
