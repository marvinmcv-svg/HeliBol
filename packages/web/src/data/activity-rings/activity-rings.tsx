"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@kinetik/core";

/** Apple-Watch-style concentric rings that sweep to their goals on view, with an overlapping lap when >100%. */
export function ActivityRings({ rings, size = 180, className }: { rings: { label: string; value: number; goal: number; color: string }[]; size?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const stroke = 14;
  return (
    <div ref={ref} className={cn("flex items-center gap-6", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" role="img" aria-label={rings.map((r) => `${r.label} ${Math.round((r.value / r.goal) * 100)}%`).join(", ")}>
        {rings.map((r, i) => {
          const rad = size / 2 - stroke / 2 - i * (stroke + 3);
          const p = r.value / r.goal;
          return (
            <g key={r.label}>
              <circle cx={size / 2} cy={size / 2} r={rad} fill="none" stroke={r.color} strokeOpacity=".18" strokeWidth={stroke} />
              <motion.circle cx={size / 2} cy={size / 2} r={rad} fill="none" stroke={r.color} strokeWidth={stroke} strokeLinecap="round" pathLength={1} initial={{ pathLength: 0 }} animate={inView ? { pathLength: Math.min(1, p) } : {}} transition={{ delay: i * 0.18, duration: 1.4, ease: [0.16, 1, 0.3, 1] }} />
              {p > 1 && <motion.circle cx={size / 2} cy={size / 2} r={rad} fill="none" stroke={r.color} strokeWidth={stroke} strokeLinecap="round" pathLength={1} style={{ filter: "drop-shadow(0 0 3px rgb(0 0 0 / .5))" }} initial={{ pathLength: 0 }} animate={inView ? { pathLength: p - 1 } : {}} transition={{ delay: 1.4 + i * 0.18, duration: 0.8 }} />}
            </g>
          );
        })}
      </svg>
      <dl className="space-y-2 text-sm">
        {rings.map((r) => <div key={r.label}><dt className="text-xs text-muted-foreground">{r.label}</dt><dd className="font-semibold tabular-nums" style={{ color: r.color }}>{r.value}/{r.goal}</dd></div>)}
      </dl>
    </div>
  );
}
