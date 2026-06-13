import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogTitle, Input, Label, Button } from "@/ui/design-system";
import type { EventItem } from "@/domain/event";
import { useAuth } from "@/ui/shared/auth/auth-context";
import { ValidatedField } from "@/ui/shared/forms/validated-field";
import * as validate from "@/lib/validation";
import {
  listEventsAdminFn,
  createEventFn,
  updateEventFn,
  deleteEventFn,
} from "@/server/admin-content";
import { AdminHeader, RowActions } from "./components/admin-header";

const toLocalInput = (d: Date) => {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

export function AdminEventsPage() {
  const { auth } = useAuth();
  const [items, setItems] = useState<EventItem[]>([]);
  const [editing, setEditing] = useState<EventItem | "new" | null>(null);

  const load = useCallback(async () => {
    const token = await auth.getAccessToken();
    if (!token) return;
    try {
      setItems(await listEventsAdminFn({ data: { token } }));
    } catch {
      /* ignore */
    }
  }, [auth]);
  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: string) {
    if (!window.confirm("Bu etkinlik silinsin mi?")) return;
    const token = await auth.getAccessToken();
    if (!token) return;
    try {
      await deleteEventFn({ data: { token, id } });
      toast.success("Silindi.");
      await load();
    } catch {
      toast.error("Silinemedi.");
    }
  }

  return (
    <div>
      <AdminHeader title="Etkinlikler" newLabel="yeni etkinlik" onNew={() => setEditing("new")} />

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">
            <tr className="border-b border-border/40">
              <th className="py-2 pr-3">başlık</th>
              <th className="py-2 pr-3">tarih</th>
              <th className="py-2 pr-3">yer</th>
              <th className="py-2 text-right">işlem</th>
            </tr>
          </thead>
          <tbody>
            {items.map((e) => (
              <tr key={e.id} className="border-b border-border/20 text-cream/85">
                <td className="py-2.5 pr-3">{e.title}</td>
                <td className="whitespace-nowrap py-2.5 pr-3 font-mono text-[10px] text-muted-foreground/60">
                  {format(e.startsAt, "dd.MM.yyyy HH:mm")}
                </td>
                <td className="py-2.5 pr-3 text-muted-foreground/70">{e.location || "—"}</td>
                <td className="py-2.5">
                  <RowActions onEdit={() => setEditing(e)} onDelete={() => remove(e.id)} />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted-foreground/50">
                  Henüz etkinlik yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <EventForm
          initial={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await load();
          }}
        />
      )}
    </div>
  );
}

function EventForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: EventItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { auth } = useAuth();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [startsAt, setStartsAt] = useState(
    initial ? toLocalInput(initial.startsAt) : toLocalInput(new Date()),
  );
  const [location, setLocation] = useState(initial?.location ?? "");
  const [link, setLink] = useState(initial?.link ?? "");
  const [busy, setBusy] = useState(false);

  const titleErr = validate.required(title, "Başlık");
  const canSave = !titleErr && !!startsAt && !busy;

  async function save() {
    if (!canSave) return;
    const token = await auth.getAccessToken();
    if (!token) return;
    setBusy(true);
    const event = {
      title: title.trim(),
      description: description.trim() || null,
      startsAt: new Date(startsAt).toISOString(),
      location: location.trim() || null,
      link: link.trim() || null,
    };
    try {
      if (initial) await updateEventFn({ data: { token, id: initial.id, event } });
      else await createEventFn({ data: { token, event } });
      toast.success("Kaydedildi.");
      onSaved();
    } catch {
      toast.error("Kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogTitle>{initial ? "Etkinliği düzenle" : "Yeni etkinlik"}</DialogTitle>
        <div className="mt-2 space-y-4">
          <ValidatedField label="başlık" value={title} onChange={setTitle} error={titleErr} />
          <div className="space-y-1.5">
            <Label htmlFor="ev-desc">açıklama</Label>
            <Input
              id="ev-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ev-date">tarih & saat</Label>
            <Input
              id="ev-date"
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ev-loc">yer</Label>
              <Input id="ev-loc" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ev-link">link</Label>
              <Input id="ev-link" value={link} onChange={(e) => setLink(e.target.value)} />
            </div>
          </div>
          <Button variant="cream" size="lg" className="w-full" disabled={!canSave} onClick={save}>
            {busy ? "kaydediliyor…" : "kaydet"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
