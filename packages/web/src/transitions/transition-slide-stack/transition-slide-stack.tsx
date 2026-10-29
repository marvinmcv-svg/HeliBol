"use client";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { cn, useReducedMotion } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface TransitionSlideStackProps {
  /** Key of the current screen — changing it triggers the transition. */
  screenKey: string;
  /** 1 = push (new screen from the right), -1 = pop. */
  direction: 1 | -1;
  children: ReactNode;
  className?: string;
}

/** iOS-style push/pop between screens: incoming slides over, outgoing parallaxes 30% and dims. */
export function TransitionSlideStack({ screenKey, direction, children, className }: TransitionSlideStackProps) {
  const reduced = useReducedMotion();
  const variants = {
    enter: (d: number) => (reduced ? { opacity: 0 } : { x: d > 0 ? "100%" : "-30%", opacity: d > 0 ? 1 : 0.6, zIndex: d > 0 ? 2 : 0 }),
    center: { x: 0, opacity: 1, zIndex: 1 },
    exit: (d: number) => (reduced ? { opacity: 0 } : { x: d > 0 ? "-30%" : "100%", opacity: d > 0 ? 0.6 : 1, zIndex: d > 0 ? 0 : 2 }),
  };
  return (
    <div className={cn("relative h-full overflow-hidden", className)}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={screenKey}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={spring.smooth}
          className="absolute inset-0 bg-background shadow-[-12px_0_32px_-12px_rgb(0_0_0/0.25)]"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
