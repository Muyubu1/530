import { DAYS } from "../lib/mock-journey";
import { DayNode, type NodeState } from "./day-node";

const W = 300;
const AMP = 80;
const R = 24;
const GAP = 72;
const CX = 150;

export function JourneyMap({
  currentDay,
  onPickToday,
}: {
  currentDay: number;
  onPickToday: () => void;
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
          strokeOpacity="0.16"
          strokeWidth="2"
          strokeDasharray="2 9"
          strokeLinecap="round"
        />
      </svg>
      {DAYS.map((d, i) => {
        const state: NodeState =
          d.day < currentDay ? "done" : d.day === currentDay ? "today" : "locked";
        const p = pts[i];
        return (
          <div key={d.day} className="absolute" style={{ left: p.x - R, top: p.y - R }}>
            <DayNode
              day={d.day}
              state={state}
              onClick={state === "today" ? onPickToday : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}
