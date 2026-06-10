import type { ComponentType } from "react";
import { Copy, CornerUpLeft, Pin, Trash2 } from "lucide-react";
import { QuickReactBar } from "./quick-react-bar";
import { cn } from "@/lib/utils";

export interface ContextMenuProps {
  x: number;
  y: number;
  mine: boolean;
  canCopy: boolean;
  onReact: (emoji: string) => void;
  onMoreEmoji: () => void;
  onReply: () => void;
  onPin: () => void;
  onCopy: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function ContextMenu({
  x,
  y,
  mine,
  canCopy,
  onReact,
  onMoreEmoji,
  onReply,
  onPin,
  onCopy,
  onDelete,
  onClose,
}: ContextMenuProps) {
  const vw = typeof window !== "undefined" ? window.innerWidth : 360;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const left = Math.min(Math.max(8, x), vw - 196);
  const top = Math.min(Math.max(8, y), vh - 280);

  return (
    <div className="fixed inset-0 z-[110]" onClick={onClose}>
      <div
        className="absolute flex flex-col gap-2"
        style={{ top, left }}
        onClick={(e) => e.stopPropagation()}
      >
        <QuickReactBar
          onPick={(e) => {
            onReact(e);
            onClose();
          }}
          onMore={onMoreEmoji}
        />
        <div className="w-44 overflow-hidden rounded-2xl border border-border/60 bg-background/95 p-1 shadow-lg backdrop-blur">
          <Item
            icon={CornerUpLeft}
            label="Yanıtla"
            onClick={() => {
              onReply();
              onClose();
            }}
          />
          <Item
            icon={Pin}
            label="Sabitle"
            onClick={() => {
              onPin();
              onClose();
            }}
          />
          {canCopy && (
            <Item
              icon={Copy}
              label="Kopyala"
              onClick={() => {
                onCopy();
                onClose();
              }}
            />
          )}
          {mine && (
            <Item
              icon={Trash2}
              label="Sil"
              danger
              onClick={() => {
                onDelete();
                onClose();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Item({
  icon: Icon,
  label,
  danger,
  onClick,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-cream/[0.06]",
        danger ? "text-destructive" : "text-cream/90",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
