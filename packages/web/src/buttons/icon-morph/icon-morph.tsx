"use client";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export type IconMorphKind = "menu-close" | "play-pause" | "plus-minus" | "arrow-check";

/** Icons whose strokes morph between two states (not a crossfade): menu↔close, play↔pause, plus↔minus, arrow↔check. */
export function IconMorph({ kind, active, className }: { kind: IconMorphKind; active: boolean; className?: string }) {
  const reduced = useReducedMotion();
  const t = reduced ? { duration: 0 } : spring.snappy;
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" className={cn("size-6", className)} aria-hidden {...common}>
      {kind === "menu-close" && (
        <>
          <motion.path initial={false} animate={{ d: active ? "M6 6L18 18" : "M4 7L20 7" }} transition={t} />
          <motion.path initial={false} animate={{ d: active ? "M12 12L12 12" : "M4 12L20 12", opacity: active ? 0 : 1 }} transition={t} />
          <motion.path initial={false} animate={{ d: active ? "M6 18L18 6" : "M4 17L20 17" }} transition={t} />
        </>
      )}
      {kind === "play-pause" && (
        <>
          <motion.path initial={false} fill="currentColor" animate={{ d: active ? "M7 5L10 5L10 19L7 19Z" : "M7 4L13 8L13 16L7 20Z" }} transition={t} />
          <motion.path initial={false} fill="currentColor" animate={{ d: active ? "M14 5L17 5L17 19L14 19Z" : "M13 8L19 12L19 12L13 16Z" }} transition={t} />
        </>
      )}
      {kind === "plus-minus" && (
        <>
          <path d="M5 12h14" />
          <motion.path d="M12 5v14" initial={false} animate={{ rotate: active ? 90 : 0, opacity: active ? 0 : 1 }} style={{ originX: "12px", originY: "12px" }} transition={t} />
        </>
      )}
      {kind === "arrow-check" && <motion.path initial={false} animate={{ d: active ? "M5 12.5L10 17L19 7" : "M5 12L19 12M13 6L19 12L13 18" }} transition={t} />}
    </svg>
  );
}
