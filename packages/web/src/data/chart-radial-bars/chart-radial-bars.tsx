"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface ChartRadialBarsProps {
  data: { label: string; value: number; color: string }[];
  /** Value that maps to a full 270° sweep. */
  max?: number;
  size?: number;
  centerLabel?: string;
  className?: string;
}

const START = 135; // degrees — open at the bottom like a gauge
const SWEEP = 270;

function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${x0},${y0} A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1},${y1}`;
}

/**
 * Concentric radial bars (Apple-Fitness style, gauge-shaped): rings sweep in one after another when
 * visible, hovering or focusing a ring brightens it, dims the others and swaps the centre readout.
 * A legend doubles as an accessible list of values.
 */
export function ChartRadialBars({ data, max = 100, size = 240, centerLabel = "Total", className }: ChartRadialBarsProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  const [active, setActive] = useState<number | null>(null);
  const c = size / 2, gap = 16, stroke = 11;
  const total = data.reduce((s, d) => s + d.value, 0);
  const cur = active === null ? null : data[active];

  return (
    <div ref={ref} className={cn("flex flex-wrap items-center justify-center gap-6", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="size-full" aria-hidden>
          {data.map((d, i) => {
            const r = c - stroke - i * gap;
            const frac = Math.min(1, d.value / max);
            const dim = active !== null && active !== i;
            return (
              <g key={d.label} onPointerEnter={() => setActive(i)} onPointerLeave={() => setActive(null)}>
                <path d={arc(c, c, r, START, START + SWEEP)} fill="none" stroke={d.color} strokeOpacity=".15" strokeWidth={stroke} strokeLinecap="round" />
                <motion.path
                  d={arc(c, c, r, START, START + SWEEP * Math.max(frac, 0.001))}
                  fill="none"
                  stroke={d.color}
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  initial={reduced ? false : { pathLength: 0 }}
                  animate={{ pathLength: seen || reduced ? 1 : 0, opacity: dim ? 0.3 : 1, strokeWidth: active === i ? stroke + 3 : stroke }}
                  transition={{ pathLength: { duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: reduced ? 0 : i * 0.15 }, opacity: { duration: 0.2 }, strokeWidth: { duration: 0.2 } }}
                  style={{ filter: active === i ? `drop-shadow(0 0 6px ${d.color})` : undefined }}
                />
              </g>
            );
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <motion.div key={active ?? "t"} initial={reduced ? false : { opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
            <p className="text-3xl font-semibold tabular-nums">{cur ? cur.value : total}</p>
            <p className="text-xs text-muted-foreground">{cur ? cur.label : centerLabel}</p>
          </motion.div>
        </div>
      </div>
      <ul className="space-y-2 text-sm">
        {data.map((d, i) => (
          <li key={d.label}>
            <button type="button" onFocus={() => setActive(i)} onBlur={() => setActive(null)} onPointerEnter={() => setActive(i)} onPointerLeave={() => setActive(null)} className={cn("flex items-center gap-2 rounded-md px-1 transition-opacity", active !== null && active !== i && "opacity-40")}>
              <span className="size-2.5 rounded-full" style={{ background: d.color }} />
              <span>{d.label}</span>
              <span className="ml-3 font-semibold tabular-nums">{d.value}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
