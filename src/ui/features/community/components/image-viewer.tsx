import { useRef, useState } from "react";
import { Download, X } from "lucide-react";

export function ImageViewer({ url, onClose }: { url: string; onClose: () => void }) {
  const startY = useRef<number | null>(null);
  const [dy, setDy] = useState(0);

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
      onPointerDown={(e) => (startY.current = e.clientY)}
      onPointerMove={(e) => {
        if (startY.current != null) setDy(Math.max(0, e.clientY - startY.current));
      }}
      onPointerUp={() => {
        if (dy > 110) onClose();
        setDy(0);
        startY.current = null;
      }}
    >
      <img
        src={url}
        alt=""
        className="max-h-full max-w-full object-contain"
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: dy ? `translateY(${dy}px)` : undefined,
          transition: startY.current != null ? "none" : "transform 0.2s ease-out",
          opacity: dy ? Math.max(0.3, 1 - dy / 300) : 1,
        }}
      />
      <button
        type="button"
        onClick={onClose}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label="kapat"
        className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/60 text-cream backdrop-blur"
      >
        <X className="h-5 w-5" />
      </button>
      <a
        href={url}
        download
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label="indir"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/60 text-cream backdrop-blur"
      >
        <Download className="h-5 w-5" />
      </a>
    </div>
  );
}
