import { Dialog, DialogContent, DialogTitle, Eyebrow, Button } from "@/ui/design-system";
import { DAYS } from "../lib/mock-journey";
import { TaskRow } from "./task-row";

export function DayModal({
  day,
  editable,
  isTaskDone,
  isDayComplete,
  onToggle,
  onCompleteDay,
  onClose,
}: {
  day: number;
  editable: boolean;
  isTaskDone: (day: number, id: string) => boolean;
  isDayComplete: (day: number) => boolean;
  onToggle: (day: number, id: string) => void;
  onCompleteDay: () => void;
  onClose: () => void;
}) {
  const data = DAYS[day - 1];
  const allDone = isDayComplete(day);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <div>
          <Eyebrow size="md">patika · {day}. gün</Eyebrow>
          <DialogTitle className="mt-1.5 text-3xl">{data.theme}</DialogTitle>

          <div className="mt-4 space-y-3">
            {data.tasks.map((t) => (
              <TaskRow
                key={t.id}
                task={t}
                done={isTaskDone(day, t.id)}
                editable={editable}
                onToggle={() => onToggle(day, t.id)}
              />
            ))}
          </div>

          {editable ? (
            allDone && (
              <Button variant="cream" size="lg" className="mt-5 w-full" onClick={onCompleteDay}>
                Günü tamamla →
              </Button>
            )
          ) : (
            <p className="mt-5 text-center font-mono text-xs uppercase tracking-[0.25em] text-emerald-300/80">
              bu gün tamamlandı
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
