"use client";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

/** Brand intro preloader: a big counter races to 100 with an easing curve, then the panel wipes up to reveal the page. Skippable. */
export function PreloaderCounter({ children, duration = 2.2, className }: { children: ReactNode; duration?: number; className?: string }) {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return setDone(true);
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, reduced]);
  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {children}
      <AnimatePresence>
        {!done && (
          <motion.div exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.9, ease: [0.77, 0, 0.18, 1] }} className="absolute inset-0 z-50 flex flex-col justify-between bg-zinc-950 p-6 text-white" style={{ clipPath: "inset(0 0 0% 0)" }} role="status" aria-label={`Loading ${n}%`}>
            <div className="flex justify-between text-xs tracking-widest text-white/50 uppercase"><span>Kinetik Studio</span><button onClick={() => setDone(true)} className="hover:text-white">Skip</button></div>
            <div className="flex items-end justify-between">
              <span className="text-[22cqw] leading-none font-black tabular-nums [container-type:inline-size]">{n}</span>
              <span className="mb-4 text-sm text-white/50">%</span>
            </div>
            <div className="h-px bg-white/15"><motion.div className="h-full bg-white" style={{ width: `${n}%` }} /></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
