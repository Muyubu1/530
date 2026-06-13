import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogTitle, Label, Button } from "@/ui/design-system";
import type { UpdateItem } from "@/domain/update";
import { useAuth } from "@/ui/shared/auth/auth-context";
import { ValidatedField } from "@/ui/shared/forms/validated-field";
import * as validate from "@/lib/validation";
import { listUpdatesFn } from "@/server/updates";
import { createUpdateFn, updateUpdateFn, deleteUpdateFn } from "@/server/admin-content";
import { AdminHeader, RowActions } from "./components/admin-header";

const toLocalInput = (d: Date) => {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

export function AdminUpdatesPage() {
  const { auth } = useAuth();
  const [items, setItems] = useState<UpdateItem[]>([]);
  const [editing, setEditing] = useState<UpdateItem | "new" | null>(null);

  const load = useCallback(async () => {
    try {
      setItems(await listUpdatesFn());
    } catch {
      /* ignore */
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: string) {
    if (!window.confirm("Bu güncelleme silinsin mi?")) return;
    const token = await auth.getAccessToken();
    if (!token) return;
    try {
      await deleteUpdateFn({ data: { token, id } });
      toast.success("Silindi.");
      await load();
    } catch {
      toast.error("Silinemedi.");
    }
  }

  return (
    <div>
      <AdminHeader title="Güncellemeler" newLabel="yeni duyuru" onNew={() => setEditing("new")} />

      <div className="mt-8 space-y-3">
        {items.map((u) => (
          <div
            key={u.id}
            className="flex items-start justify-between gap-4 rounded-xl border border-border/40 bg-card/30 p-4"
          >
            <div className="min-w-0">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">
                {format(u.publishedAt, "dd.MM.yyyy")}
              </p>
              <p className="mt-1 text-sm text-cream">{u.title}</p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground/60">{u.content}</p>
            </div>
            <RowActions onEdit={() => setEditing(u)} onDelete={() => remove(u.id)} />
          </div>
        ))}
        {items.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground/50">Henüz güncelleme yok.</p>
        )}
      </div>

      {editing && (
        <UpdateForm
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

function UpdateForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: UpdateItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { auth } = useAuth();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [publishedAt, setPublishedAt] = useState(
    initial ? toLocalInput(initial.publishedAt) : toLocalInput(new Date()),
  );
  const [busy, setBusy] = useState(false);

  const titleErr = validate.required(title, "Başlık");
  const contentErr = validate.required(content, "İçerik");
  const canSave = !titleErr && !contentErr && !busy;

  async function save() {
    if (!canSave) return;
    const token = await auth.getAccessToken();
    if (!token) return;
    setBusy(true);
    const update = {
      title: title.trim(),
      content: content.trim(),
      publishedAt: new Date(publishedAt).toISOString(),
    };
    try {
      if (initial) await updateUpdateFn({ data: { token, id: initial.id, update } });
      else await createUpdateFn({ data: { token, update } });
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
        <DialogTitle>{initial ? "Duyuruyu düzenle" : "Yeni duyuru"}</DialogTitle>
        <div className="mt-2 space-y-4">
          <ValidatedField label="başlık" value={title} onChange={setTitle} error={titleErr} />
          <div className="space-y-1.5">
            <Label htmlFor="up-content">içerik</Label>
            <textarea
              id="up-content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full resize-none rounded-md border border-border/60 bg-transparent px-4 py-2 text-sm text-cream placeholder:text-muted-foreground/40 focus:border-cream focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="up-date">yayın tarihi</Label>
            <input
              id="up-date"
              type="datetime-local"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="flex h-11 w-full rounded-md border border-border/60 bg-transparent px-4 py-2 text-sm text-cream focus:border-cream focus:outline-none"
            />
          </div>
          <Button variant="cream" size="lg" className="w-full" disabled={!canSave} onClick={save}>
            {busy ? "kaydediliyor…" : "kaydet"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
