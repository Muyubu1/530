import { CalendarDays, Flame, Trophy, type LucideIcon } from "lucide-react";

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 rounded-xl border border-border/40 bg-card/30 py-3">
      <Icon className="h-4 w-4 text-cream/70" strokeWidth={1.5} />
      <span className="font-display text-lg text-cream">{value}</span>
      <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground/50">
        {label}
      </span>
    </div>
  );
}

export function StatBar({
  currentDay,
  total,
  streak,
  points,
}: {
  currentDay: number;
  total: number;
  streak: number;
  points: number;
}) {
  return (
    <div className="flex gap-3">
      <Stat icon={CalendarDays} value={`${Math.min(currentDay, total)}/${total}`} label="gün" />
      <Stat icon={Flame} value={streak} label="seri" />
      <Stat icon={Trophy} value={points} label="puan" />
    </div>
  );
}
