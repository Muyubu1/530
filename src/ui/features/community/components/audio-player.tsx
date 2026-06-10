import { useMemo, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

const BAR_COUNT = 38;

function waveform(seed: string): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const bars: number[] = [];
  for (let i = 0; i < BAR_COUNT; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    bars.push(0.25 + ((h % 1000) / 1000) * 0.75);
  }
  return bars;
}

function fmt(s: number): string {
  if (!isFinite(s) || s <= 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function AudioPlayer({ url }: { url: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const bars = useMemo(() => waveform(url), [url]);

  function toggle() {
    const a = ref.current;
    if (!a) return;
    if (playing) a.pause();
    else void a.play();
  }

  return (
    <div className="flex w-56 items-center gap-3 py-1">
      <audio
        ref={ref}
        src={url}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => {
          const d = e.currentTarget.duration;
          setProgress(isFinite(d) && d > 0 ? e.currentTarget.currentTime / d : 0);
        }}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "duraklat" : "oynat"}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream text-background"
      >
        {playing ? (
          <Pause className="h-4 w-4 fill-current" />
        ) : (
          <Play className="h-4 w-4 fill-current" />
        )}
      </button>
      <div className="flex h-8 flex-1 items-center gap-[2px]">
        {bars.map((bh, i) => (
          <span
            key={i}
            className="w-[2px] shrink-0 rounded-full"
            style={{
              height: `${bh * 100}%`,
              background:
                i / BAR_COUNT <= progress
                  ? "var(--cream)"
                  : "color-mix(in oklab, var(--cream) 28%, transparent)",
            }}
          />
        ))}
      </div>
      <span className="shrink-0 font-mono text-[10px] text-muted-foreground/60">
        {fmt(duration)}
      </span>
    </div>
  );
}
