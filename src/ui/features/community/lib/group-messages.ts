import { format, isToday, isYesterday } from "date-fns";
import { tr } from "date-fns/locale";
import type { ChatMessage } from "@/domain/chat";

const GROUP_GAP_MS = 5 * 60 * 1000;

export type RenderItem =
  | { kind: "date"; id: string; label: string }
  | { kind: "message"; message: ChatMessage; groupStart: boolean };

function dayLabel(d: Date): string {
  if (isToday(d)) return "Bugün";
  if (isYesterday(d)) return "Dün";
  return format(d, "d MMMM yyyy", { locale: tr });
}

/** Flattens messages into render items with date separators + grouping flags. */
export function buildRenderItems(messages: ChatMessage[]): RenderItem[] {
  const items: RenderItem[] = [];
  let prev: ChatMessage | null = null;

  for (const m of messages) {
    const d = new Date(m.createdAt);
    const prevD = prev ? new Date(prev.createdAt) : null;
    const newDay = !prevD || d.toDateString() !== prevD.toDateString();

    if (newDay) items.push({ kind: "date", id: `date-${m.id}`, label: dayLabel(d) });

    const groupStart =
      newDay ||
      !prev ||
      prev.userId !== m.userId ||
      d.getTime() - (prevD?.getTime() ?? 0) > GROUP_GAP_MS;

    items.push({ kind: "message", message: m, groupStart });
    prev = m;
  }

  return items;
}
