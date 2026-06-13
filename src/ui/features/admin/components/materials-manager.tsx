import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, Input, Label, Button } from "@/ui/design-system";
import type { Material } from "@/domain/material";
import { useAuth } from "@/ui/shared/auth/auth-context";
import { listMaterialsFn } from "@/server/materials";
import { createMaterialFn, updateMaterialFn, deleteMaterialFn } from "@/server/admin-content";

export function MaterialsManager({ lessonId, onClose }: { lessonId: string; onClose: () => void }) {
  const { auth } = useAuth();
  const [items, setItems] = useState<Material[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("pdf");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await listMaterialsFn({ data: { lessonId } }));
    } catch {
      /* ignore */
    }
  }, [lessonId]);
  useEffect(() => {
    load();
  }, [load]);

  function reset() {
    setEditId(null);
    setTitle("");
    setFileUrl("");
    setFileType("pdf");
  }

  async function save() {
    if (!title.trim() || !fileUrl.trim()) return;
    const token = await auth.getAccessToken();
    if (!token) return;
    setBusy(true);
    const base = {
      title: title.trim(),
      fileUrl: fileUrl.trim(),
      fileType: fileType.trim() || null,
      fileSizeBytes: null,
      orderIndex: items.length,
    };
    try {
      if (editId) await updateMaterialFn({ data: { token, id: editId, material: base } });
      else await createMaterialFn({ data: { token, material: { ...base, lessonId } } });
      reset();
      await load();
    } catch {
      toast.error("Kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    const token = await auth.getAccessToken();
    if (!token) return;
    try {
      await deleteMaterialFn({ data: { token, id } });
      if (editId === id) reset();
      await load();
    } catch {
      toast.error("Silinemedi.");
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogTitle>Materyaller</DialogTitle>
        <div className="mt-2 space-y-2">
          {items.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-card/30 px-3 py-2"
            >
              <button
                type="button"
                onClick={() => {
                  setEditId(m.id);
                  setTitle(m.title);
                  setFileUrl(m.fileUrl);
                  setFileType(m.fileType ?? "");
                }}
                className="min-w-0 flex-1 text-left text-xs text-cream/85 hover:text-cream"
              >
                <span className="block truncate">{m.title}</span>
                <span className="block truncate font-mono text-[9px] text-muted-foreground/40">
                  {m.fileType || "dosya"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => remove(m.id)}
                aria-label="sil"
                className="text-destructive/70 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <p className="py-2 text-center text-xs text-muted-foreground/50">Materyal yok.</p>
          )}
        </div>

        <div className="mt-4 space-y-3 border-t border-border/40 pt-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">
            {editId ? "düzenle" : "yeni materyal"}
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="m-title">başlık</Label>
            <Input id="m-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="m-url">dosya URL</Label>
            <Input
              id="m-url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://…"
            />
          </div>
          <div className="flex items-end gap-3">
            <div className="w-28 space-y-1.5">
              <Label htmlFor="m-type">tür</Label>
              <Input id="m-type" value={fileType} onChange={(e) => setFileType(e.target.value)} />
            </div>
            <Button
              variant="cream"
              size="sm"
              className="flex-1"
              disabled={busy || !title.trim() || !fileUrl.trim()}
              onClick={save}
            >
              {editId ? "güncelle" : "ekle"}
            </Button>
            {editId && (
              <Button variant="ghost" size="sm" onClick={reset}>
                iptal
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
