import { Eyebrow, Heading } from "@/ui/design-system";
import type { EventItem } from "@/domain/event";
import { whenLine, dayNum, monthShort } from "./event-format";

/** Upcoming events as an editorial date-led list. */
export function EventsPage({ events }: { events: EventItem[] }) {
  return (
    <div className="animate-rise mx-auto max-w-2xl">
      <div className="text-center">
        <Eyebrow size="sm">etkinlikler · agenda</Eyebrow>
        <Heading as="h1" size="xl" className="mt-6">
          Yaklaşan buluşmalar.
        </Heading>
      </div>

      {events.length === 0 ? (
        <p className="mt-12 text-center text-sm text-muted-foreground/70">Şimdilik etkinlik yok.</p>
      ) : (
        <ul className="mt-12 divide-y divide-border/40">
          {events.map((e) => (
            <li key={e.id} className="grid grid-cols-12 items-start gap-4 py-6">
              <div className="col-span-3 sm:col-span-2">
                <p className="font-display text-3xl font-semibold leading-none text-cream">
                  {dayNum(e.startsAt)}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
                  {monthShort(e.startsAt)}
                </p>
              </div>
              <div className="col-span-9 sm:col-span-8">
                <p className="font-display text-sm font-medium tracking-[-0.005em] text-cream sm:text-base">
                  {e.title}
                </p>
                {e.description && (
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground/70">
                    {e.description}
                  </p>
                )}
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50">
                  {whenLine(e.startsAt)}
                  {e.location && ` · ${e.location}`}
                </p>
              </div>
              <div className="col-span-12 text-left sm:col-span-2 sm:text-right">
                {e.link ? (
                  <a
                    href={e.link}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[10px] uppercase tracking-[0.25em] text-cream/80 transition-colors hover:text-cream"
                  >
                    detay →
                  </a>
                ) : (
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/40">
                    yakında
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
