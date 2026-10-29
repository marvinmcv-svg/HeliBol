"use client";
import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useMotionValueEvent } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";
import { easeBezier } from "@kinetik/tokens";

export interface Stat {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** % change; positive renders green ↑, negative red ↓ */
  delta?: number;
  spark?: number[];
}

function Ticker({ s, play }: { s: Stat; play: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(0);
  const reduced = useReducedMotion();
  const fmt = new Intl.NumberFormat(undefined, { minimumFractionDigits: s.decimals ?? 0, maximumFractionDigits: s.decimals ?? 0 });
  useMotionValueEvent(mv, "change", (v) => ref.current && (ref.current.textContent = `${s.prefix ?? ""}${fmt.format(v)}${s.suffix ?? ""}`));
  useEffect(() => {
    if (!play) return;
    if (reduced) return mv.jump(s.value);
    const c = animate(mv, s.value, { duration: 1.6, ease: easeBezier.expoOut });
    return () => c.stop();
  }, [play, s.value, reduced, mv]);
  return <span ref={ref} className="tabular-nums">{`${s.prefix ?? ""}${fmt.format(0)}${s.suffix ?? ""}`}</span>;
}

function Spark({ data, up, play }: { data: number[]; up: boolean; play: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * 100},${28 - ((d - min) / (max - min || 1)) * 26}`).join(" ");
  return (
    <svg viewBox="0 0 100 30" className="h-8 w-full" preserveAspectRatio="none" aria-hidden>
      <motion.polyline points={pts} fill="none" stroke={up ? "#10b981" : "#ef4444"} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: play ? 1 : 0 }} transition={{ duration: 1.4, ease: easeBezier.expoOut, delay: 0.2 }} />
    </svg>
  );
}

export function StatCounterGrid({ stats, className }: { stats: Stat[]; className?: string }) {
  const ref = useRef<HTMLDListElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  return (
    <dl ref={ref} className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {stats.map((s, i) => {
        const up = (s.delta ?? 0) >= 0;
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.08, duration: 0.5, ease: easeBezier.expoOut }}
            className="rounded-2xl border border-border bg-card p-4"
          >
            <dt className="text-xs text-muted-foreground">{s.label}</dt>
            <dd className="mt-1 flex items-baseline justify-between gap-2">
              <span className="text-2xl font-semibold tracking-tight"><Ticker s={s} play={inView} /></span>
              {s.delta !== undefined && (
                <span className={cn("rounded-full px-1.5 py-0.5 text-[11px] font-medium", up ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-red-500/15 text-red-600 dark:text-red-400")}>
                  {up ? "↑" : "↓"} {Math.abs(s.delta)}%
                </span>
              )}
            </dd>
            {s.spark && <div className="mt-2"><Spark data={s.spark} up={up} play={inView} /></div>}
          </motion.div>
        );
      })}
    </dl>
  );
}
