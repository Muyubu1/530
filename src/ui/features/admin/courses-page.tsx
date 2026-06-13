import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Input,
  Label,
  Button,
  Checkbox,
} from "@/ui/design-system";
import type { CourseWithLessons } from "@/domain/course";
import { useAuth } from "@/ui/shared/auth/auth-context";
import { ValidatedField } from "@/ui/shared/forms/validated-field";
import * as validate from "@/lib/validation";
import {
  listCoursesAdminFn,
  createCourseFn,
  updateCourseFn,
  deleteCourseFn,
} from "@/server/admin-content";
import { AdminHeader, RowActions } from "./components/admin-header";

export function AdminCoursesPage() {
  const { auth } = useAuth();
  const [items, setItems] = useState<CourseWithLessons[]>([]);
  const [editing, setEditing] = useState<CourseWithLessons | "new" | null>(null);

  const load = useCallback(async () => {
    const token = await auth.getAccessToken();
    if (!token) return;
    try {
      setItems(await listCoursesAdminFn({ data: { token } }));
    } catch {
      /* ignore */
    }
  }, [auth]);
  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: string) {
    if (!window.confirm("Kurs ve tüm dersleri silinsin mi?")) return;
    const token = await auth.getAccessToken();
    if (!token) return;
    try {
      await deleteCourseFn({ data: { token, id } });
      toast.success("Silindi.");
      await load();
    } catch {
      toast.error("Silinemedi.");
    }
  }

  return (
    <div>
      <AdminHeader title="Kurslar" newLabel="yeni kurs" onNew={() => setEditing("new")} />

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">
            <tr className="border-b border-border/40">
              <th className="py-2 pr-3">başlık</th>
              <th className="py-2 pr-3">sıra</th>
              <th className="py-2 pr-3">ders</th>
              <th className="py-2 pr-3">durum</th>
              <th className="py-2 text-right">işlem</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-b border-border/20 text-cream/85">
                <td className="py-2.5 pr-3">
                  <Link
                    to="/admin/kurslar/$courseId"
                    params={{ courseId: c.id }}
                    className="transition-colors hover:text-cream hover:underline"
                  >
                    {c.title}
                  </Link>
                </td>
                <td className="py-2.5 pr-3 font-mono text-muted-foreground/60">{c.orderIndex}</td>
                <td className="py-2.5 pr-3 font-mono text-muted-foreground/60">
                  {c.lessons.length}
                </td>
                <td className="py-2.5 pr-3">
                  <span
                    className={
                      c.isPublished
                        ? "font-mono text-[9px] uppercase tracking-[0.15em] text-emerald-300"
                        : "font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/50"
                    }
                  >
                    {c.isPublished ? "yayında" : "taslak"}
                  </span>
                </td>
                <td className="py-2.5">
                  <RowActions onEdit={() => setEditing(c)} onDelete={() => remove(c.id)} />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground/50">
                  Henüz kurs yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <CourseForm
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

function CourseForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: CourseWithLessons | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { auth } = useAuth();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [orderIndex, setOrderIndex] = useState(String(initial?.orderIndex ?? 0));
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? true);
  const [busy, setBusy] = useState(false);

  const titleErr = validate.required(title, "Başlık");
  const canSave = !titleErr && !busy;

  async function save() {
    if (!canSave) return;
    const token = await auth.getAccessToken();
    if (!token) return;
    setBusy(true);
    const course = {
      title: title.trim(),
      description: description.trim() || null,
      coverImage: coverImage.trim() || null,
      orderIndex: Number(orderIndex) || 0,
      isPublished,
    };
    try {
      if (initial) await updateCourseFn({ data: { token, id: initial.id, course } });
      else await createCourseFn({ data: { token, course } });
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
        <DialogTitle>{initial ? "Kursu düzenle" : "Yeni kurs"}</DialogTitle>
        <div className="mt-2 space-y-4">
          <ValidatedField label="başlık" value={title} onChange={setTitle} error={titleErr} />
          <div className="space-y-1.5">
            <Label htmlFor="c-desc">açıklama</Label>
            <Input
              id="c-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-cover">kapak görseli (URL)</Label>
            <Input
              id="c-cover"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://…"
            />
          </div>
          <div className="flex items-end justify-between gap-4">
            <div className="w-24 space-y-1.5">
              <Label htmlFor="c-order">sıra</Label>
              <Input
                id="c-order"
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(e.target.value)}
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 pb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
              <Checkbox checked={isPublished} onCheckedChange={(v) => setIsPublished(v === true)} />
              yayında
            </label>
          </div>
          <Button variant="cream" size="lg" className="w-full" disabled={!canSave} onClick={save}>
            {busy ? "kaydediliyor…" : "kaydet"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
