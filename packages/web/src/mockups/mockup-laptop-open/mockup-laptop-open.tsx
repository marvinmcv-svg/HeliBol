"use client";
import { useRef, type ReactNode } from "react";
import { motion, useInView } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface MockupLaptopOpenProps {
  /** Screen content (shown once the lid is open). */
  children: ReactNode;
  className?: string;
}

/**
 * A laptop that opens as it scrolls into view: the lid hinges up from closed (CSS 3D), the screen
 * wakes with a soft glow, then the content fades in. The base keeps a keyboard well and trackpad
 * for realism. Reduced motion: shown open.
 */
export function MockupLaptopOpen({ children, className }: MockupLaptopOpenProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const open = useInView(ref, { once: true, amount: 0.5 }) || reduced;
  const ease = [0.22, 1, 0.36, 1] as const;
  return (
    <div ref={ref} className={cn("relative w-full max-w-xl", className)} style={{ perspective: 1600 }}>
      {/* lid */}
      <motion.div
        className="relative mx-auto w-[86%] origin-bottom"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{ rotateX: open ? 0 : -88 }}
        transition={{ duration: reduced ? 0 : 1.4, ease }}
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-zinc-900 p-[2.2%] shadow-[0_-10px_60px_-20px_rgb(0_0_0/.5)] ring-1 ring-zinc-700" style={{ backfaceVisibility: "hidden" }}>
          <div className="relative size-full overflow-hidden rounded-md bg-black">
            <motion.div className="size-full" initial={false} animate={{ opacity: open ? 1 : 0, filter: open ? "brightness(1)" : "brightness(2.5)" }} transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : 1.1 }}>
              {children}
            </motion.div>
            <motion.span aria-hidden className="pointer-events-none absolute inset-0 bg-white" initial={false} animate={{ opacity: open ? [0, 0.35, 0] : 0 }} transition={{ duration: 0.7, delay: reduced ? 0 : 1 }} />
            <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
          </div>
          <span aria-hidden className="absolute left-1/2 top-[0.6%] size-1.5 -translate-x-1/2 rounded-full bg-zinc-700" />
        </div>
      </motion.div>
      {/* base */}
      <div className="relative mx-auto h-4 w-full rounded-b-2xl rounded-t-sm bg-gradient-to-b from-zinc-400 to-zinc-600 shadow-[0_20px_40px_-10px_rgb(0_0_0/.5)] dark:from-zinc-500 dark:to-zinc-700">
        <span aria-hidden className="absolute left-1/2 top-0 h-1.5 w-1/6 -translate-x-1/2 rounded-b-lg bg-zinc-700/60" />
      </div>
    </div>
  );
}
