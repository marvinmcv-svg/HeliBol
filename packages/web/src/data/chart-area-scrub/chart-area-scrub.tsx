"use client";
import { useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface ChartAreaScrubProps {
  data: { label: string; value: number }[];
  /** Format for the value readout. */
  format?: (v: number) => string;
  color?: string;
  title?: string;
  className?: string;
}

const W = 600, H = 220, PAD = 8;

/** Smooth path through points (monotone-ish cubic using midpoints). */
function smooth(pts: [number, number][]) {
  return pts.reduce((d, [x, y], i) => {
    if (i === 0) return `M${x},${y}`;
    const [px, py] = pts[i - 1];
    const cx = (px + x) / 2;
    return `${d} C${cx},${py} ${cx},${y} ${x},${y}`;
  }, "");
}

/**
 * Stock-app area chart: the line draws in when it scrolls into view and the gradient fill fades up;
 * scrubbing (pointer or arrow keys) snaps a crosshair to the nearest point, the headline number
 * rolls to that value, the delta vs. the first point updates, and everything right of the cursor
 * dims.
 */
export function ChartAreaScrub({ data, format = (v) => v.toLocaleString(), color = "#22c55e", title = "Revenue", className }: ChartAreaScrubProps) {
  const reduced = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  const [hover, setHover] = useState<number | null>(null);
  const { pts, line, area } = useMemo(() => {
    const vs = data.map((d) => d.value);
    const min = Math.min(...vs), max = Math.max(...vs);
    const pts = data.map((d, i) => [PAD + (i / (data.length - 1)) * (W - PAD * 2), PAD + (1 - (d.value - min) / (max - min || 1)) * (H - PAD * 2 - 20)] as [number, number]);
    const line = smooth(pts);
    return { pts, line, area: `${line} L${pts.at(-1)![0]},${H} L${pts[0][0]},${H} Z` };
  }, [data]);
  const idx = hover ?? data.length - 1;
  const cur = data[idx];
  const delta = ((cur.value - data[0].value) / data[0].value) * 100;
  const up = delta >= 0;
  const pick = (clientX: number) => {
    const r = ref.current!.querySelector("svg")!.getBoundingClientRect();
    const x = ((clientX - r.left) / r.width) * W;
    let best = 0;
    pts.forEach(([px], i) => Math.abs(px - x) < Math.abs(pts[best][0] - x) && (best = i));
    setHover(best);
  };

  return (
    <div ref={ref} className={cn("w-full rounded-3xl border border-border bg-card p-5", className)}>
      <p className="text-sm text-muted-foreground">{title}</p>
      <div className="mt-1 flex items-baseline gap-3">
        <div className="relative h-9 overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p key={idx} initial={reduced ? false : { y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduced ? undefined : { y: -16, opacity: 0 }} transition={{ duration: 0.18 }} className="text-3xl font-semibold tabular-nums tracking-tight">
              {format(cur.value)}
            </motion.p>
          </AnimatePresence>
        </div>
        <span className={cn("text-sm font-medium tabular-nums", up ? "text-emerald-500" : "text-rose-500")}>{up ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%</span>
        <span className="ml-auto text-xs text-muted-foreground">{cur.label}</span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-3 w-full touch-none overflow-visible outline-none focus-visible:ring-2 focus-visible:ring-ring"
        role="slider"
        tabIndex={0}
        aria-label={`${title} by period`}
        aria-valuemin={0}
        aria-valuemax={data.length - 1}
        aria-valuenow={idx}
        aria-valuetext={`${cur.label}: ${format(cur.value)}`}
        onPointerMove={(e) => pick(e.clientX)}
        onPointerDown={(e) => pick(e.clientX)}
        onPointerLeave={() => setHover(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setHover(Math.max(0, idx - 1));
          if (e.key === "ArrowRight") setHover(Math.min(data.length - 1, idx + 1));
        }}
      >
        <defs>
          <linearGradient id={`${id}-f`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".35" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient>
          <clipPath id={`${id}-c`}><motion.rect x="0" y="-20" height={H + 40} animate={{ width: hover === null ? W : pts[idx][0] }} transition={{ type: "spring", stiffness: 500, damping: 40 }} /></clipPath>
        </defs>
        <motion.path d={area} fill={`url(#${id}-f)`} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: seen || reduced ? 1 : 0 }} transition={{ duration: 0.8, delay: 0.6 }} />
        <path d={line} fill="none" stroke={color} strokeOpacity=".25" strokeWidth="2.5" />
        <motion.path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" clipPath={`url(#${id}-c)`} initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: seen || reduced ? 1 : 0 }} transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }} />
        {hover !== null && (
          <g>
            <line x1={pts[idx][0]} x2={pts[idx][0]} y1="0" y2={H} stroke="currentColor" strokeOpacity=".25" strokeDasharray="3 4" />
            <motion.circle initial={false} animate={{ cx: pts[idx][0], cy: pts[idx][1] }} transition={{ type: "spring", stiffness: 500, damping: 40 }} r="6" fill={color} stroke="var(--color-card, #fff)" strokeWidth="3" />
          </g>
        )}
      </svg>
    </div>
  );
}
