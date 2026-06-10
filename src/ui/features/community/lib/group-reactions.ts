import type { Reaction } from "@/domain/chat";

export interface ReactionGroup {
  emoji: string;
  count: number;
  /** The current user's reaction id for this emoji, if any (for toggling). */
  mineId?: string;
}

export function groupReactions(reactions: Reaction[], meId?: string): ReactionGroup[] {
  const map = new Map<string, ReactionGroup>();
  for (const r of reactions) {
    const group = map.get(r.emoji) ?? { emoji: r.emoji, count: 0 };
    group.count += 1;
    if (r.userId === meId) group.mineId = r.id;
    map.set(r.emoji, group);
  }
  return [...map.values()];
}
