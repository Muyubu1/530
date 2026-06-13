import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, Paperclip } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Input,
  Label,
  Button,
  Eyebrow,
  Heading,
} from "@/ui/design-system";
import type { CourseWithLessons, Lesson } from "@/domain/course";
import { useAuth } from "@/ui/shared/auth/auth-context";
import { ValidatedField } from "@/ui/shared/forms/validated-field";
import * as validate from "@/lib/validation";
import {
  listCoursesAdminFn,
  createLessonFn,
  updateLessonFn,
  deleteLessonFn,
} from "@/server/admin-content";
import { AdminHeader, RowActions } from "./components/admin-header";
import { MaterialsManager } from "./components/materials-manager";

export function AdminCourseDetailPage({ courseId }: { courseId: string }) {
  const { auth } = useAuth();
  const [course, setCourse] = useState<CourseWithLessons | null>(null);
  const [editing, setEditing] = useState<Lesson | "new" | null>(null);
  const [materialsFor, setMaterialsFor] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = await auth.getAccessToken();
    if (!token) return;
    try {
      const all = await listCoursesAdminFn({ data: { token } });
      setCourse(all.find((c) => c.id === courseId) ?? null);
    } catch {
      /* ignore */
    }
  }, [auth, courseId]);
  useEffect(() => {
    load();
  }, [load]);

  async function removeLesson(id: string) {
    if (!window.confirm("Ders silinsin mi?")) return;
    const token = await auth.getAccessToken();
    if (!token) return;
    try {
      await deleteLessonFn({ data: { token, id } });
      toast.success("Silindi.");
      await load();
    } catch {
      toast.error("Silinemedi.");
    }
  }

  if (!course) {
    return <p className="mt-20 text-center text-sm text-muted-foreground/50">Yükleniyor…</p>;
  }

  return (
    <div>
      <Link
        to="/admin/kurslar"
        className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 transition-colors hover:text-cream"
      >
        <ArrowLeft className="h-3 w-3" /> kurslar
      </Link>
      <div className="mt-3">
        <Eyebrow size="sm">yönetim · kurs</Eyebrow>
        <Heading as="h1" size="xl" className="mt-3">
          {course.title}
        </Heading>
      </div>

      <div className="mt-8">
        <AdminHeader title="Dersler" newLabel="yeni ders" onNew={() => setEditing("new")} />
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">
            <tr className="border-b border-border/40">
              <th className="py-2 pr-3">sıra</th>
              <th className="py-2 pr-3">başlık</th>
              <th className="py-2 pr-3">süre</th>
              <th className="py-2 pr-3">materyal</th>
              <th className="py-2 text-right">işlem</th>
            </tr>
          </thead>
          <tbody>
            {course.lessons.map((l) => (
              <tr key={l.id} className="border-b border-border/20 text-cream/85">
                <td className="py-2.5 pr-3 font-mono text-muted-foreground/60">{l.orderIndex}</td>
                <td className="py-2.5 pr-3">{l.title}</td>
                <td className="py-2.5 pr-3 font-mono text-muted-foreground/60">
                  {l.durationMinutes ? `${l.durationMinutes} dk` : "—"}
                </td>
                <td className="py-2.5 pr-3">
                  <button
                    type="button"
                    onClick={() => setMaterialsFor(l.id)}
                    className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/70 hover:text-cream"
                  >
                    <Paperclip className="h-3 w-3" /> yönet
                  </button>
                </td>
                <td className="py-2.5">
                  <RowActions onEdit={() => setEditing(l)} onDelete={() => removeLesson(l.id)} />
                </td>
              </tr>
            ))}
            {course.lessons.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground/50">
                  Henüz ders yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <LessonForm
          courseId={courseId}
          initial={editing === "new" ? null : editing}
          nextOrder={course.lessons.length}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await load();
          }}
        />
      )}
      {materialsFor && (
        <MaterialsManager lessonId={materialsFor} onClose={() => setMaterialsFor(null)} />
      )}
    </div>
  );
}

function LessonForm({
  courseId,
  initial,
  nextOrder,
  onClose,
  onSaved,
}: {
  courseId: string;
  initial: Lesson | null;
  nextOrder: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { auth } = useAuth();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [videoUrl, setVideoUrl] = useState(initial?.videoUrl ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initial?.thumbnailUrl ?? "");
  const [duration, setDuration] = useState(String(initial?.durationMinutes ?? ""));
  const [orderIndex, setOrderIndex] = useState(String(initial?.orderIndex ?? nextOrder));
  const [busy, setBusy] = useState(false);

  const titleErr = validate.required(title, "Başlık");
  const canSave = !titleErr && !busy;

  async function save() {
    if (!canSave) return;
    const token = await auth.getAccessToken();
    if (!token) return;
    setBusy(true);
    const lesson = {
      title: title.trim(),
      description: description.trim() || null,
      videoUrl: videoUrl.trim() || null,
      thumbnailUrl: thumbnailUrl.trim() || null,
      durationMinutes: duration ? Number(duration) : null,
      orderIndex: Number(orderIndex) || 0,
    };
    try {
      if (initial) await updateLessonFn({ data: { token, id: initial.id, lesson } });
      else await createLessonFn({ data: { token, lesson: { ...lesson, courseId } } });
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
        <DialogTitle>{initial ? "Dersi düzenle" : "Yeni ders"}</DialogTitle>
        <div className="mt-2 space-y-4">
          <ValidatedField label="başlık" value={title} onChange={setTitle} error={titleErr} />
          <div className="space-y-1.5">
            <Label htmlFor="l-desc">açıklama</Label>
            <Input
              id="l-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="l-video">video URL</Label>
            <Input
              id="l-video"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://…"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="l-thumb">kapak görseli URL</Label>
            <Input
              id="l-thumb"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://…"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="l-dur">süre (dk)</Label>
              <Input
                id="l-dur"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="l-order">sıra</Label>
              <Input
                id="l-order"
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(e.target.value)}
              />
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
