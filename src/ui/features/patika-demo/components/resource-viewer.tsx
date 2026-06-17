import { Dialog, DialogContent, DialogTitle } from "@/ui/design-system";
import type { DemoResource } from "../lib/mock-journey";

/**
 * In-app resource viewer — opens as a pop-up over the current screen (no new tab)
 * with the media embedded: video player, audio player, or an inline PDF/document.
 */
export function ResourceViewer({
  resource,
  onClose,
}: {
  resource: DemoResource | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!resource} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl">
        {resource && (
          <div>
            <DialogTitle className="pr-8 text-xl">{resource.title}</DialogTitle>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/55">
              {resource.meta}
            </p>

            <div className="mt-4">
              {resource.kind === "video" && (
                <video
                  src={resource.url}
                  controls
                  autoPlay
                  playsInline
                  className="aspect-video w-full rounded-xl bg-black"
                />
              )}

              {resource.kind === "audio" && (
                <div className="rounded-xl border border-border/40 bg-card/30 p-6">
                  <audio src={resource.url} controls autoPlay className="w-full" />
                </div>
              )}

              {resource.kind === "doc" &&
                (/\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(resource.url) ? (
                  <img
                    src={resource.url}
                    alt={resource.title}
                    className="max-h-[70vh] w-full rounded-xl bg-card/30 object-contain"
                  />
                ) : (
                  <>
                    <iframe
                      title={resource.title}
                      src={resource.url}
                      className="h-[60vh] w-full rounded-xl border border-border/40 bg-white md:h-[70vh]"
                    />
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60 transition-colors hover:text-cream"
                    >
                      yeni sekmede aç →
                    </a>
                  </>
                ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
