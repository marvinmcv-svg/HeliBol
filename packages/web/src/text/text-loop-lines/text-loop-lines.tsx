"use client";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface TextLoopLinesProps {
  items: ReactNode[];
  interval?: number;
  direction?: "up" | "down";
  className?: string;
}

/** Cycles whole lines (or any nodes) vertically through a masked slot — status lines, testimonials, tickers. */
export function TextLoopLines({ items, interval = 2400, direction = "up", className }: TextLoopLinesProps) {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % items.length), interval);
    return () => clearInterval(t);
  }, [items.length, interval]);
  const d = direction === "up" ? 1 : -1;
  return (
    <div className={cn("relative overflow-hidden", className)} aria-live="polite">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={i}
          initial={reduced ? { opacity: 0 } : { y: `${100 * d}%`, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: `${-100 * d}%`, opacity: 0 }}
          transition={spring.smooth}
        >
          {items[i]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
