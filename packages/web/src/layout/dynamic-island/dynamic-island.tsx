"use client";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@kinetik/core";

export interface IslandState {
  id: string;
  /** Width/height of the pill in this state. */
  size: { width: number; height: number };
  radius?: number;
  content: ReactNode;
}

export interface DynamicIslandProps {
  state: IslandState;
  className?: string;
}

const islandSpring = { type: "spring" as const, stiffness: 400, damping: 30, mass: 0.9 };

/** A black pill that morphs between arbitrary sizes and contents with a slightly bouncy spring. */
export function DynamicIsland({ state, className }: DynamicIslandProps) {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={false}
      animate={{ width: state.size.width, height: state.size.height, borderRadius: state.radius ?? state.size.height / 2 }}
      transition={islandSpring}
      className={cn("relative mx-auto overflow-hidden bg-black text-white shadow-[0_8px_30px_rgb(0_0_0/.35)] ring-1 ring-white/10", className)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={state.id}
          initial={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)", transition: { delay: 0.08, duration: 0.25 } }}
          exit={{ opacity: 0, scale: 0.9, filter: "blur(6px)", transition: { duration: 0.12 } }}
          className="absolute inset-0"
        >
          {state.content}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
