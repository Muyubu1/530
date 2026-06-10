import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Eyebrow, Heading } from "@/ui/design-system";
import type { UpdateItem } from "@/domain/update";

export function UpdatesPage({ updates }: { updates: UpdateItem[] }) {
  return (
    <div className="animate-rise mx-auto max-w-2xl">
      <Eyebrow size="sm">güncellemeler</Eyebrow>
      <Heading as="h1" size="xl" className="mt-6">
        Neler oluyor?
      </Heading>

      {updates.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground/70">Şimdilik güncelleme yok.</p>
      ) : (
        <ul className="mt-10 space-y-8 border-l border-border/40 pl-6">
          {updates.map((u) => (
            <li key={u.id} className="relative">
              <span className="absolute -left-[1.65rem] top-1.5 h-2 w-2 rounded-full bg-cream/60" />
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/50">
                {format(new Date(u.publishedAt), "d MMM yyyy", { locale: tr })}
              </p>
              <h2 className="mt-1 font-display text-base font-medium tracking-tight text-cream">
                {u.title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground/80">{u.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
