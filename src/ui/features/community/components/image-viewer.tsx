import { Download, X } from "lucide-react";

export function ImageViewer({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <img
        src={url}
        alt=""
        className="max-h-full max-w-full object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        type="button"
        onClick={onClose}
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
        aria-label="indir"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/60 text-cream backdrop-blur"
      >
        <Download className="h-5 w-5" />
      </a>
    </div>
  );
}
