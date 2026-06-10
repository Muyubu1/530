import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const CORNER_BRACKETS = [
  "top-3 left-3 border-l border-t",
  "top-3 right-3 border-r border-t",
  "bottom-3 left-3 border-l border-b",
  "bottom-3 right-3 border-r border-b",
];

const FRAME_SHADOW =
  "0 0 0 1px rgba(255,255,255,0.04), 0 60px 160px -30px rgba(0,0,0,0.95), 0 0 120px -20px rgba(255,255,255,0.04), inset 0 0 140px rgba(0,0,0,0.5)";

/** The bracketed cinematic video player from the VSL section. Self-contained. */
export function CinematicVideoFrame({
  src,
  poster,
  caption,
  className,
}: {
  src: string;
  poster?: string;
  caption?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [pauseHint, setPauseHint] = useState(0);

  return (
    <figure className={cn("relative mx-auto w-full max-w-3xl", className)}>
      <div
        className="relative overflow-hidden rounded-[2px] border border-white/10"
        style={{ boxShadow: FRAME_SHADOW }}
      >
        {CORNER_BRACKETS.map((pos) => (
          <span
            key={pos}
            className={cn("pointer-events-none absolute z-20 h-3 w-3 border-white/35", pos)}
          />
        ))}

        <div
          className="relative aspect-video w-full bg-black"
          onContextMenu={(e) => e.preventDefault()}
        >
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            playsInline
            controls={playing}
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
            onPlay={() => {
              setPlaying(true);
              setPauseHint((n) => n + 1);
            }}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {pauseHint > 0 && playing && (
            <span
              key={pauseHint}
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              style={{ animation: "vsl-pause-hint 1.1s ease-out forwards" }}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background/70 text-cream backdrop-blur sm:h-20 sm:w-20">
                <Pause className="h-5 w-5 fill-current sm:h-8 sm:w-8" />
              </span>
            </span>
          )}
          {!playing && (
            <button
              type="button"
              onClick={() => videoRef.current?.play()}
              aria-label="Videoyu oynat"
              className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/20"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/95 text-background shadow-[0_8px_32px_-4px_color-mix(in_oklab,var(--gold)_55%,transparent)] transition-transform hover:scale-105 sm:h-20 sm:w-20">
                <Play className="h-5 w-5 fill-current sm:h-8 sm:w-8" />
              </span>
            </button>
          )}
        </div>
      </div>

      {caption && (
        <figcaption className="mt-5 flex items-center justify-center gap-3 font-mono text-[9px] uppercase tracking-[0.5em] text-white/35">
          <span className="h-px w-6 bg-white/20" />
          <span>{caption}</span>
          <span className="h-px w-6 bg-white/20" />
        </figcaption>
      )}
    </figure>
  );
}
