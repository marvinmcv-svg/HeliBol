"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Flame } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface WidgetHabitTrackerProps {
  habit: string;
  /** Number of weeks shown (7 days each). */
  weeks?: number;
  /** Initially completed day indexes (0 = oldest). */
  defaultDone?: number[];
  color?: string;
  className?: string;
}

/**
 * Habit tracker grid: tap a day and it fills with a pop and a ring burst; the streak flame counter
 * rolls to the new value and flickers bigger the longer the streak. Today is outlined. Each cell is a
 * toggle button with its date in the label.
 */
export function WidgetHabitTracker({ habit, weeks = 6, defaultDone = [], color = "#22c55e", className }: WidgetHabitTrackerProps) {
  const reduced = useReducedMotion();
  const total = weeks * 7, today = total - 1;
  const [done, setDone] = useState(() => new Set(defaultDone));
  const [burst, setBurst] = useState<number | null>(null);
  const streak = useMemo(() => {
    let s = 0;
    for (let d = done.has(today) ? today : today - 1; d >= 0 && done.has(d); d--) s++;
    return s;
  }, [done, today]);
  const toggle = (d: number) => {
    const n = new Set(done);
    if (n.has(d)) n.delete(d);
    else (n.add(d), setBurst(d));
    setDone(n);
  };
  const label = (d: number) => (d === today ? "Today" : `${today - d} day${today - d > 1 ? "s" : ""} ago`);

  return (
    <div className={cn("w-[300px] rounded-[28px] border bg-card p-5 shadow-lg", className)}>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Habit</p>
          <p className="text-lg font-semibold">{habit}</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-1 text-orange-500" aria-label={`${streak} day streak`}>
          <motion.span animate={reduced || !streak ? {} : { scale: [1, 1 + Math.min(streak, 10) * 0.03, 1], rotate: [-4, 4, -4] }} transition={{ duration: 0.9, repeat: Infinity }}>
            <Flame className="size-4" fill="currentColor" />
          </motion.span>
          <span className="relative h-5 min-w-4 overflow-hidden font-mono text-sm font-semibold tabular-nums">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span key={streak} className="block" initial={{ y: reduced ? 0 : 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: reduced ? 0 : -16, opacity: 0 }}>{streak}</motion.span>
            </AnimatePresence>
          </span>
        </div>
      </div>
      <div className="grid grid-flow-col grid-rows-7 gap-1.5">
        {Array.from({ length: total }, (_, d) => {
          const on = done.has(d);
          return (
            <button key={d} type="button" aria-pressed={on} aria-label={`${label(d)}: ${on ? "done" : "not done"}`} onClick={() => toggle(d)} className={cn("relative aspect-square rounded-[6px] bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", d === today && "ring-1 ring-foreground/40")}>
              <motion.span className="absolute inset-0 rounded-[6px]" style={{ background: color }} initial={false} animate={{ scale: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 18 }} />
              {burst === d && on && !reduced && (
                <motion.span key={`b${d}`} className="pointer-events-none absolute inset-0 rounded-[6px] border-2" style={{ borderColor: color }} initial={{ scale: 1, opacity: 0.9 }} animate={{ scale: 2.4, opacity: 0 }} transition={{ duration: 0.55 }} onAnimationComplete={() => setBurst(null)} />
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{done.size} of {total} days · tap a day to log it</p>
    </div>
  );
}
