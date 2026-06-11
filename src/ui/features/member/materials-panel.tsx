import { useEffect, useState } from "react";
import { Download, FileText } from "lucide-react";
import type { Material } from "@/domain/material";
import { listMaterialsFn } from "@/server/materials";
import { formatBytes } from "@/lib/format-bytes";

export function MaterialsPanel({ lessonId }: { lessonId: string }) {
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    let cancelled = false;
    listMaterialsFn({ data: { lessonId } })
      .then((m) => !cancelled && setMaterials(m))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  if (materials.length === 0) return null;

  return (
    <div className="mt-8 rounded-xl border border-border/40 bg-card/30 p-4 sm:p-5">
      <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">
        materyaller · {materials.length}
      </p>
      <div className="mt-4 space-y-2">
        {materials.map((m) => (
          <a
            key={m.id}
            href={m.fileUrl}
            target="_blank"
            rel="noreferrer"
            download
            className="group flex items-center gap-3 rounded-md border border-border/30 bg-background/40 p-3 transition-colors hover:border-cream/40"
          >
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-cream/20 bg-cream/5 text-cream/80">
              <FileText className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-medium text-cream">{m.title}</span>
              <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">
                {m.fileType ?? "dosya"}
                {m.fileSizeBytes ? ` · ${formatBytes(m.fileSizeBytes)}` : ""}
              </span>
            </span>
            <Download className="h-4 w-4 flex-shrink-0 text-muted-foreground/50 transition-colors group-hover:text-cream" />
          </a>
        ))}
      </div>
    </div>
  );
}
