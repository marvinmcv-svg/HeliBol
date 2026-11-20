"use client";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { cn, useInView, useReducedMotion } from "@kinetik/core";

export interface FunnelStage { label: string; value: number }
export interface ChartFunnelProps {
  stages: FunnelStage[];
  colors?: [string, string];
  title?: string;
  className?: string;
}

/**
 * Conversion funnel drawn as one continuous, smoothly tapering SVG shape: each stage pours in from
 * the top when scrolled into view, the drop-off between stages appears as a pill, and hovering (or
 * focusing) a stage highlights its band and shows the share of the top of the funnel.
 */
export function ChartFunnel({ stages, colors = ["#8b5cf6", "#22d3ee"], title = "Conversion", className }: ChartFunnelProps) {
  const reduced = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { amount: 0.4 });
  const [hover, setHover] = useState<number | null>(null);
  const W = 360, BAND = 56, top = stages[0]?.value || 1, n = stages.length;
  const half = (i: number) => ((stages[Math.min(i, n - 1)]!.value / top) * W) / 2;
  const id = `kn-fun-${title.replace(/\W/g, "")}`;
  const show = reduced || inView;

  return (
    <div ref={box} className={cn("w-full max-w-xl rounded-3xl border bg-card p-6", className)}>
      <p className="mb-4 text-sm font-medium text-muted-foreground">{title}</p>
      <div className="flex gap-4">
        <svg viewBox={`${-W / 2} 0 ${W} ${BAND * n}`} className="w-[62%] shrink-0 overflow-visible" role="img" aria-label={stages.map((s) => `${s.label} ${s.value.toLocaleString()}`).join(", ")}>
          <defs>
            <linearGradient id={id} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={colors[0]} /><stop offset="1" stopColor={colors[1]} /></linearGradient>
          </defs>
          {stages.map((_, i) => {
            const a = half(i), b = half(i + 1), y0 = i * BAND, y1 = y0 + BAND, m = (y0 + y1) / 2;
            const d = `M${-a} ${y0} L${a} ${y0} C${a} ${m} ${b} ${m} ${b} ${y1} L${-b} ${y1} C${-b} ${m} ${-a} ${m} ${-a} ${y0} Z`;
            return (
              <motion.path
                key={i}
                d={d}
                fill={`url(#${id})`}
                initial={false}
                animate={{ opacity: show ? (hover === null || hover === i ? 1 : 0.35) : 0, scaleY: show ? 1 : 0 }}
                style={{ originY: 0 }}
                transition={{ duration: reduced ? 0 : 0.5, delay: reduced || hover !== null ? 0 : i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              />
            );
          })}
          {stages.map((_, i) => i > 0 && <line key={`l${i}`} x1={-W / 2} x2={W / 2} y1={i * BAND} y2={i * BAND} className="stroke-card" strokeWidth="2" />)}
        </svg>
        <ul className="flex flex-1 flex-col">
          {stages.map((s, i) => {
            const drop = i > 0 ? 1 - s.value / stages[i - 1]!.value : 0;
            return (
              <li key={s.label} style={{ height: `${100 / n}%` }} className="relative">
                <button type="button" onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} className={cn("flex h-full w-full flex-col justify-center rounded-lg px-2 text-left transition-colors", hover === i && "bg-muted")}>
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <span className="font-mono text-base font-semibold tabular-nums">{s.value.toLocaleString()}{hover === i && <span className="ml-1.5 text-xs font-normal text-muted-foreground">{Math.round((s.value / top) * 100)}%</span>}</span>
                </button>
                {i > 0 && (
                  <motion.span initial={false} animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.6 }} transition={{ delay: reduced ? 0 : 0.3 + i * 0.15 }} className="absolute -top-2.5 right-0 rounded-full bg-rose-500/10 px-1.5 py-0.5 font-mono text-[10px] text-rose-500">
                    −{Math.round(drop * 100)}%
                  </motion.span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
