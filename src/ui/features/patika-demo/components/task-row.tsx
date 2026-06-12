import { useState } from "react";
import {
  BookOpen,
  Check,
  Droplet,
  Dumbbell,
  PenLine,
  Sunrise,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/ui/design-system";
import { cn } from "@/lib/utils";
import type { DemoTask, TaskIcon } from "../lib/mock-journey";

const ICONS: Record<TaskIcon, LucideIcon> = {
  sunrise: Sunrise,
  move: Dumbbell,
  read: BookOpen,
  water: Droplet,
  reflect: PenLine,
};

export function TaskRow({
  task,
  done,
  editable,
  onToggle,
}: {
  task: DemoTask;
  done: boolean;
  editable: boolean;
  onToggle: () => void;
}) {
  const Icon = ICONS[task.icon];
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");

  return (
    <Card variant="subtle" className={cn("p-4 transition-colors", done && "border-emerald-500/30")}>
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors",
            done
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
              : "border-cream/25 bg-cream/10 text-cream",
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <p className={cn("text-sm text-cream", done && "text-cream/50 line-through")}>
            {task.title}
          </p>
          <p className="text-xs text-muted-foreground/60">{task.detail}</p>
        </div>
        <button
          type="button"
          disabled={!editable}
          onClick={onToggle}
          aria-label={done ? "geri al" : "tamamla"}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all active:scale-90",
            done
              ? "scale-100 border-emerald-500 bg-emerald-500 text-background"
              : "border-cream/40 text-transparent hover:border-cream hover:bg-cream/10",
            !editable && "opacity-40",
          )}
        >
          <Check className="h-4 w-4" strokeWidth={3} />
        </button>
      </div>

      {editable &&
        (noteOpen ? (
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="kısa not (isteğe bağlı)…"
            className="mt-3 w-full resize-none rounded-md border border-border/50 bg-background/40 px-2 py-1.5 text-xs text-cream placeholder:text-muted-foreground/40 focus:border-cream/40 focus:outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => setNoteOpen(true)}
            className="mt-2 pl-12 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40 transition-colors hover:text-cream/60"
          >
            + not ekle
          </button>
        ))}
    </Card>
  );
}
