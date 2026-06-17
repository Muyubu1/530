import { DAYS } from "../lib/mock-journey";
import { DayNode, type NodeState } from "./day-node";

const W = 340;
const AMP = 96;
const R = 28;
const GAP = 84;
const CX = 170;

export function JourneyMap({
  currentDay,
  onPickDay,
}: {
  currentDay: number;
  onPickDay: (day: number) => void;
}) {
  const pts = DAYS.map((_, i) => ({ x: CX + AMP * Math.sin(i * 0.7), y: R + i * GAP }));
  const height = R * 2 + (DAYS.length - 1) * GAP;
  const line = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  return (
    <div className="relative mx-auto" style={{ width: W, height }}>
      <svg
        className="pointer-events-none absolute inset-0"
        width={W}
        height={height}
        viewBox={`0 0 ${W} ${height}`}
      >
        <polyline
          points={line}
          fill="none"
          stroke="oklch(0.98 0 0)"
          strokeOpacity="0.22"
          strokeWidth="2"
          strokeDasharray="2 9"
          strokeLinecap="round"
          style={{ animation: "path-flow 3s linear infinite" }}
        />
      </svg>
      {DAYS.map((d, i) => {
        const state: NodeState =
          d.day < currentDay ? "done" : d.day === currentDay ? "today" : "locked";
        const p = pts[i];
        return (
          <div
            key={d.day}
            className="absolute [animation:node-pop_0.45s_ease-out_both]"
            style={{ left: p.x - R, top: p.y - R, animationDelay: `${i * 30}ms` }}
          >
            <DayNode
              day={d.day}
              state={state}
              onClick={state === "locked" ? undefined : () => onPickDay(d.day)}
            />
          </div>
        );
      })}
    </div>
  );
}
