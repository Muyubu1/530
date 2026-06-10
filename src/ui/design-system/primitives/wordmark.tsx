import { cn } from "@/lib/utils";
import logo530 from "@/assets/logo-530.png";

type WordmarkTone = "cream" | "ink" | "full";
type WordmarkSize = "sm" | "md" | "lg";

const logoTone: Record<WordmarkTone, string> = {
  cream: "opacity-80",
  ink: "brightness-0", // black logo, for light backgrounds
  full: "",
};

const labTone: Record<WordmarkTone, string> = {
  cream: "text-cream/50",
  ink: "text-black/70",
  full: "text-cream/70",
};

const logoSize: Record<WordmarkSize, string> = {
  sm: "h-4",
  md: "h-5",
  lg: "h-6",
};

/** The "5.30 · lab" lockup. Single source for header / footer / coming-soon. */
export function Wordmark({
  tone = "cream",
  size = "sm",
  showLab = true,
  className,
}: {
  tone?: WordmarkTone;
  size?: WordmarkSize;
  showLab?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <img
        src={logo530}
        alt="5.30"
        draggable={false}
        className={cn("w-auto select-none", logoSize[size], logoTone[tone])}
      />
      {showLab && (
        <span className={cn("font-mono text-[9px] uppercase tracking-[0.3em]", labTone[tone])}>
          lab
        </span>
      )}
    </span>
  );
}
