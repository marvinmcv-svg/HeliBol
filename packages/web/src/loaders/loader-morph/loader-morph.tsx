"use client";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

/** A single shape that morphs circle → rounded square → triangle-ish blob while rotating — a characterful brand loader. */
export function LoaderMorph({ size = 56, color = "currentColor", label = "Loading", className }: { size?: number; color?: string; label?: string; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <span role="status" aria-label={label} className={cn("inline-grid place-items-center", className)} style={{ width: size, height: size }}>
      <motion.span
        className="block size-full"
        style={{ background: color }}
        animate={reduced ? { opacity: [0.5, 1, 0.5] } : { borderRadius: ["50%", "22%", "50% 50% 12% 50%", "50%"], rotate: [0, 90, 225, 360], scale: [1, 0.82, 1, 1] }}
        transition={{ duration: reduced ? 2 : 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </span>
  );
}
