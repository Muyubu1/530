import { useState } from "react";
import { Video, AudioLines, FileText, ExternalLink, Play, type LucideIcon } from "lucide-react";
import { Eyebrow } from "@/ui/design-system";
import { cn } from "@/lib/utils";
import type { DemoResource, ResourceKind } from "../lib/mock-journey";

const TABS: { kind: ResourceKind; label: string; Icon: LucideIcon }[] = [
  { kind: "video", label: "Video", Icon: Video },
  { kind: "audio", label: "Ses", Icon: AudioLines },
  { kind: "doc", label: "Kaynak", Icon: FileText },
];

const ITEM_ICON: Record<ResourceKind, LucideIcon> = {
  video: Play,
  audio: AudioLines,
  doc: FileText,
};

/**
 * The day's supporting material. A mobile-nav-style segmented control (Video / Ses /
 * Kaynak); each segment is active only when that kind exists. Switching segments swaps
 * the content; selecting an item opens it. Renders nothing when the day has no material.
 */
export function ResourcePanel({ resources }: { resources: DemoResource[] }) {
  const counts: Record<ResourceKind, number> = { video: 0, audio: 0, doc: 0 };
  for (const r of resources) counts[r.kind]++;

  const firstAvailable = TABS.find((t) => counts[t.kind] > 0)?.kind ?? "video";
  const [active, setActive] = useState<ResourceKind>(firstAvailable);

  if (resources.length === 0) return null;

  const items = resources.filter((r) => r.kind === active);

  return (
    <div className="mt-6 border-t border-cream/10 pt-5">
      <Eyebrow size="sm">ek kaynaklar</Eyebrow>

      {/* mobile-nav-style segmented control */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {TABS.map(({ kind, label, Icon }) => {
          const has = counts[kind] > 0;
          const isActive = active === kind;
          return (
            <button
              key={kind}
              type="button"
              disabled={!has}
              onClick={() => setActive(kind)}
              aria-pressed={isActive}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl border py-3 transition-colors",
                isActive
                  ? "border-cream/60 bg-cream/10 text-cream"
                  : "border-border/40 text-muted-foreground/70 hover:border-cream/30 hover:text-cream/80",
                !has &&
                  "cursor-not-allowed opacity-35 hover:border-border/40 hover:text-muted-foreground/70",
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em]">{label}</span>
            </button>
          );
        })}
      </div>

      {/* content for the active segment */}
      <div className="mt-3 space-y-2">
        {items.length === 0 ? (
          <p className="rounded-xl border border-border/30 bg-card/20 px-4 py-5 text-center text-sm text-muted-foreground/55">
            Bu gün için kaynak yok.
          </p>
        ) : (
          items.map((r, i) => {
            const Icon = ITEM_ICON[r.kind];
            return (
              <a
                key={`${r.kind}-${i}`}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/30 p-3.5 transition-colors hover:border-cream/30"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cream/20 bg-cream/5 text-cream">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base text-cream">{r.title}</p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground/55">
                    {r.meta}
                  </p>
                </div>
                <ExternalLink
                  className="h-4 w-4 shrink-0 text-muted-foreground/50"
                  strokeWidth={1.75}
                />
              </a>
            );
          })
        )}
      </div>
    </div>
  );
}
