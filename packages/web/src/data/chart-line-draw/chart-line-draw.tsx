"use client";
import { useId, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@kinetik/core";
import { easeBezier } from "@kinetik/tokens";

export interface ChartLineDrawProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  className?: string;
  format?: (v: number) => string;
}

function smooth(points: [number, number][]) {
  return points.reduce((d, [x, y], i, a) => {
    if (i === 0) return `M ${x},${y}`;
    const [px, py] = a[i - 1];
    const cx = (px + x) / 2;
    return `${d} C ${cx},${py} ${cx},${y} ${x},${y}`;
  }, "");
}

export function ChartLineDraw({ data, height = 220, color = "#8b5cf6", className, format = (v) => v.toLocaleString() }: ChartLineDrawProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [hover, setHover] = useState<number | null>(null);
  const id = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const W = 600;
  const H = height;
  const pad = 12;
  const max = Math.max(...data.map((d) => d.value)) * 1.1;
  const pts = data.map((d, i) => [pad + (i / (data.length - 1)) * (W - pad * 2), H - pad - (d.value / max) * (H - pad * 2)] as [number, number]);
  const line = smooth(pts);
  const area = `${line} L ${pts[pts.length - 1][0]},${H} L ${pts[0][0]},${H} Z`;

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" role="img" aria-label={`Line chart: ${data.map((d) => `${d.label} ${format(d.value)}`).join(", ")}`} onPointerLeave={() => setHover(null)}>
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => <line key={g} x1={0} x2={W} y1={H * g} y2={H * g} className="stroke-border" strokeDasharray="4 4" />)}
        <motion.path d={area} fill={`url(#${id})`} initial={{ opacity: 0 }} animate={{ opacity: inView ? 1 : 0 }} transition={{ duration: 0.8, delay: 0.9 }} />
        <motion.path d={line} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: inView ? 1 : 0 }} transition={{ duration: 1.6, ease: easeBezier.expoOut }} />
        {pts.map(([x, y], i) => (
          <g key={i} onPointerEnter={() => setHover(i)}>
            <rect x={x - W / data.length / 2} y={0} width={W / data.length} height={H} fill="transparent" />
            <motion.circle cx={x} cy={y} r={hover === i ? 6 : 0} fill="var(--color-background, white)" stroke={color} strokeWidth="3" animate={{ r: hover === i ? 6 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 25 }} />
          </g>
        ))}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg bg-foreground px-2 py-1 text-xs text-background shadow-lg" style={{ left: `${(pts[hover][0] / W) * 100}%`, top: `${(pts[hover][1] / H) * 100 - 4}%` }}>
          {data[hover].label}: <b>{format(data[hover].value)}</b>
        </div>
      )}
      <div className="mt-2 flex justify-between px-1 text-[11px] text-muted-foreground">{data.map((d) => <span key={d.label}>{d.label}</span>)}</div>
    </div>
  );
}
