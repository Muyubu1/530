import { Plus } from "lucide-react";
import { Eyebrow, Heading, Button } from "@/ui/design-system";

export function AdminHeader({
  title,
  newLabel = "yeni",
  onNew,
}: {
  title: string;
  newLabel?: string;
  onNew?: () => void;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <Eyebrow size="sm">yönetim · {title.toLowerCase()}</Eyebrow>
        <Heading as="h1" size="xl" className="mt-4">
          {title}
        </Heading>
      </div>
      {onNew && (
        <Button variant="cream" size="sm" onClick={onNew}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          {newLabel}
        </Button>
      )}
    </div>
  );
}

/** Small row action buttons (edit / delete) for admin tables. */
export function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/70 transition-colors hover:text-cream"
      >
        düzenle
      </button>
      <span className="text-muted-foreground/30">·</span>
      <button
        type="button"
        onClick={onDelete}
        className="font-mono text-[9px] uppercase tracking-[0.2em] text-destructive/80 transition-colors hover:text-destructive"
      >
        sil
      </button>
    </div>
  );
}
