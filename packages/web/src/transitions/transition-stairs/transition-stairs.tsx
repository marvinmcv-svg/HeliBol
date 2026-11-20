"use client";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface TransitionStairsProps {
  pages: { title: string; content: ReactNode }[];
  /** Number of vertical columns. */
  steps?: number;
  color?: string;
  className?: string;
}

/**
 * "Stairs" page transition: vertical columns drop in one after another like a staircase, the page
 * swaps while covered (with a big index number), then the columns keep falling out of the bottom in
 * the same order. Reduced motion swaps instantly.
 */
export function TransitionStairs({ pages, steps = 6, color = "#111", className }: TransitionStairsProps) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [cover, setCover] = useState<number | null>(null);
  const ease = [0.76, 0, 0.24, 1] as const;
  const inDur = 0.45, stagger = 0.05;
  const go = (n: number) => {
    if (n === i || cover !== null) return;
    if (reduced) return setI(n);
    setCover(n);
    const full = (inDur + stagger * (steps - 1)) * 1000;
    setTimeout(() => setI(n), full);
    setTimeout(() => setCover(null), full + 300);
  };
  return (
    <div className={cn("relative h-full overflow-hidden", className)}>
      <nav className="absolute left-1/2 top-3 z-30 flex -translate-x-1/2 gap-1 rounded-full border border-border bg-background/80 p-1 backdrop-blur">
        {pages.map((p, n) => (
          <button key={p.title} type="button" onClick={() => go(n)} aria-current={i === n ? "page" : undefined} className={cn("rounded-full px-3 py-1 text-xs", i === n ? "bg-foreground text-background" : "text-muted-foreground")}>{p.title}</button>
        ))}
      </nav>
      <div className="h-full">{pages[i]!.content}</div>
      <AnimatePresence>
        {cover !== null && (
          <motion.div key="stairs" className="pointer-events-none absolute inset-0 z-20 flex" style={{ containerType: "size" }} exit={{ opacity: 1 }} transition={{ duration: (inDur + stagger * steps) }}>
            {Array.from({ length: steps }, (_, s) => (
              <motion.div
                key={s}
                className="h-full flex-1"
                style={{ background: color, marginLeft: -1 }}
                initial={{ y: "-100%" }}
                animate={{ y: "0%", transition: { duration: inDur, delay: s * stagger, ease } }}
                exit={{ y: "100%", transition: { duration: inDur, delay: s * stagger, ease } }}
              />
            ))}
            <motion.span
              className="absolute inset-0 grid place-items-center font-mono text-[18cqw] font-bold leading-none text-white/90"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              {String(cover + 1).padStart(2, "0")}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
