"use client";
import { useEffect, useId, useRef, useState } from "react";
import { cn, useInView, useReducedMotion } from "@kinetik/core";

export interface ChartLiveStreamProps {
  /** Provide real values; called every tick. Defaults to a random walk. */
  next?: (prev: number) => number;
  /** Visible points. */
  points?: number;
  /** ms between samples. */
  interval?: number;
  label?: string;
  unit?: string;
  color?: string;
  className?: string;
}

const W = 600, H = 180;
const randomWalk = (p: number) => Math.max(5, Math.min(95, p + (Math.random() - 0.48) * 12));

/**
 * Live streaming chart: new samples slide in from the right while the window scrolls smoothly
 * between ticks (translate interpolated on rAF, not jumping), a pulsing head dot marks the latest
 * value, and the y-range eases to fit. Pauses when off-screen; reduced motion updates per tick.
 */
export function ChartLiveStream({ next = randomWalk, points = 40, interval = 700, label = "Requests / s", unit = "", color = "#38bdf8", className }: ChartLiveStreamProps) {
  const reduced = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { once: false, amount: 0.1 });
  const [data, setData] = useState<number[]>(() => {
    const out = [50];
    for (let i = 1; i < points + 1; i++) out.push(next(out[i - 1]));
    return out;
  });
  const path = useRef<SVGGElement>(null);
  const range = useRef({ lo: 0, hi: 100 });
  const gid = `kn-ls-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setData((d) => [...d.slice(1), next(d[d.length - 1])]), interval);
    return () => clearInterval(id);
  }, [inView, interval, next]);

  // smooth scroll between ticks: shift the group left by one step over `interval`
  useEffect(() => {
    const g = path.current;
    if (!g || reduced) return;
    const t0 = performance.now();
    let raf = 0;
    const step = W / (points - 1);
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / interval);
      g.setAttribute("transform", `translate(${step * (1 - p)} 0)`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [data, interval, points, reduced]);

  const lo = Math.min(...data), hi = Math.max(...data);
  range.current.lo += (lo - 5 - range.current.lo) * 0.3;
  range.current.hi += (hi + 5 - range.current.hi) * 0.3;
  const { lo: rLo, hi: rHi } = range.current;
  const step = W / (points - 1);
  const pts = data.map((v, i) => [(i - 1) * step, H - ((v - rLo) / (rHi - rLo || 1)) * H] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  const cur = data[data.length - 1];

  return (
    <div ref={box} className={cn("w-full rounded-3xl border border-border bg-card p-5", className)}>
      <div className="flex items-baseline justify-between">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full opacity-60 motion-reduce:animate-none" style={{ background: color }} /><span className="relative inline-flex size-2 rounded-full" style={{ background: color }} /></span>
          {label}
        </p>
        <p className="text-2xl font-semibold tabular-nums" aria-live="off">{cur.toFixed(1)}{unit}</p>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full overflow-hidden" role="img" aria-label={`${label}, latest ${cur.toFixed(1)}${unit}`}>
        <defs>
          <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".3" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="currentColor" strokeOpacity=".08" />)}
        <g ref={path}>
          <path d={`${line} L${last[0]},${H} L${pts[0][0]},${H} Z`} fill={`url(#${gid})`} />
          <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx={last[0]} cy={last[1]} r="5" fill={color} />
          <circle cx={last[0]} cy={last[1]} r="10" fill={color} opacity=".25" />
        </g>
      </svg>
    </div>
  );
}
