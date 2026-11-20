"use client";
import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface MockupTabletRotateProps {
  /** Render the screen for an orientation; reflow your layout per orientation. */
  children: (orientation: "portrait" | "landscape") => ReactNode;
  defaultOrientation?: "portrait" | "landscape";
  /** Width of the long side in px. */
  size?: number;
  className?: string;
}

/**
 * Tablet mockup that physically rotates between portrait and landscape: the device spins 90° with a
 * spring while the screen counter-rotates so the content stays upright and reflows — pass a render
 * function and lay out differently per orientation (children with `layout` animate to new spots).
 */
export function MockupTabletRotate({ children, defaultOrientation = "landscape", size = 440, className }: MockupTabletRotateProps) {
  const reduced = useReducedMotion();
  const [o, setO] = useState(defaultOrientation);
  const land = o === "landscape";
  const long = size, short = Math.round(size * 0.72);
  const t = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 120, damping: 18 };
  return (
    <div className={cn("flex flex-col items-center gap-5", className)}>
      <div className="grid place-items-center" style={{ width: long, height: long * 0.86 }}>
        <motion.div
          className="relative rounded-[28px] bg-gradient-to-br from-zinc-300 via-zinc-400 to-zinc-500 p-[3px] shadow-[0_40px_80px_-30px_rgb(0_0_0/.55)] dark:from-zinc-600 dark:via-zinc-800 dark:to-zinc-700"
          initial={false}
          animate={{ width: land ? long : short, height: land ? short : long * 0.86 }}
          transition={t}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[25px] bg-black p-[12px]">
            <span aria-hidden className={cn("absolute size-1.5 rounded-full bg-zinc-700", land ? "left-[5px] top-1/2 -translate-y-1/2" : "left-1/2 top-[5px] -translate-x-1/2")} />
            <motion.div layout transition={t} className="relative h-full w-full overflow-hidden rounded-[14px] bg-background">
              {children(o)}
            </motion.div>
          </div>
        </motion.div>
      </div>
      <button type="button" onClick={() => setO(land ? "portrait" : "landscape")} aria-label={`Rotate to ${land ? "portrait" : "landscape"}`} className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-xs font-medium">
        <motion.span aria-hidden animate={{ rotate: land ? 0 : 90 }} transition={t} className="inline-block h-3 w-4 rounded-[3px] border-2 border-current" />
        {land ? "Portrait" : "Landscape"}
      </button>
    </div>
  );
}
