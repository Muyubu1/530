import { CalendarDays, Flame, Trophy, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function Stat({
  icon: Icon,
  value,
  label,
  delay,
  iconClass,
}: {
  icon: LucideIcon;
  value: string | number;
  label: string;
  delay: number;
  iconClass?: string;
}) {
  return (
    <div
      className="flex flex-1 flex-col items-center gap-2.5 rounded-2xl border border-border/40 bg-card/30 py-5 [animation:node-pop_0.5s_ease-out_both]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-cream/20 bg-cream/5">
        <Icon className={cn("h-6 w-6 text-cream", iconClass)} strokeWidth={1.75} />
      </span>
      <span className="font-display text-3xl text-cream">{value}</span>
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/55">
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
      <Stat
        icon={CalendarDays}
        value={`${Math.min(currentDay, total)}/${total}`}
        label="gün"
        delay={0}
      />
      <Stat
        icon={Flame}
        value={streak}
        label="seri"
        delay={80}
        iconClass={streak > 0 ? "animate-flicker" : undefined}
      />
      <Stat icon={Trophy} value={points} label="puan" delay={160} />
    </div>
  );
}
