"use client";
import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

/** Two-sided card that flips in 3D on click / Enter / Space (not hover-only, so it's keyboard and touch friendly). */
export function CardFlip({ front, back, label = "Flip card", className }: { front: ReactNode; back: ReactNode; label?: string; className?: string }) {
  const [flipped, setFlipped] = useState(false);
  const reduced = useReducedMotion();
  const face = "absolute inset-0 [backface-visibility:hidden] overflow-hidden rounded-2xl";
  return (
    <button onClick={() => setFlipped((f) => !f)} aria-pressed={flipped} aria-label={label} className={cn("relative rounded-2xl text-left outline-none [perspective:1000px] focus-visible:ring-2 focus-visible:ring-ring", className)}>
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={reduced ? undefined : { rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
      >
        <div className={face} style={reduced ? { opacity: flipped ? 0 : 1 } : undefined}>{front}</div>
        <div className={face} style={reduced ? { opacity: flipped ? 1 : 0 } : { transform: "rotateY(180deg)" }}>{back}</div>
      </motion.div>
    </button>
  );
}
