"use client";
import { useId } from "react";
import { motion } from "motion/react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export type ViewMode = "list" | "compact" | "cards";

export interface ViewSwitchProps {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
  className?: string;
}

/**
 * One animated glyph per mode, built from the same four rectangles; switching modes morphs the
 * rectangles (x/y/width/height springs) rather than swapping icons. A pill slides under the
 * active button.
 */
function Glyph({ mode, active }: { mode: ViewMode; active: boolean }) {
  const reduced = useReducedMotion();
  // four rects per layout: [x, y, w, h] in a 16×16 box
  const layouts: Record<ViewMode, [number, number, number, number][]> = {
    list: [[1, 2, 3, 3], [6, 2, 9, 3], [1, 9.5, 3, 3], [6, 9.5, 9, 3]],
    compact: [[1, 1.5, 14, 2], [1, 5.5, 14, 2], [1, 9.5, 14, 2], [1, 13.5, 14, 2]],
    cards: [[1, 1, 6, 6], [9, 1, 6, 6], [1, 9, 6, 6], [9, 9, 6, 6]],
  };
  return (
    <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
      {layouts[mode].map(([x, y, w, h], i) => (
        <motion.rect
          key={i}
          initial={false}
          animate={{ x, y, width: w, height: h, opacity: active ? 1 : 0.55 }}
          transition={reduced ? { duration: 0 } : { ...spring.bouncy, delay: active ? i * 0.03 : 0 }}
          rx={1}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

export function ViewSwitch({ value, onChange, className }: ViewSwitchProps) {
  const reduced = useReducedMotion();
  const group = useId();
  const modes: ViewMode[] = ["list", "compact", "cards"];
  return (
    <div role="radiogroup" aria-label="View" className={cn("inline-flex rounded-xl border border-border bg-muted/60 p-1", className)}>
      {modes.map((m) => (
        <button
          key={m}
          type="button"
          role="radio"
          aria-checked={value === m}
          aria-label={`${m} view`}
          onClick={() => onChange(m)}
          className={cn("relative grid h-8 w-10 place-items-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", value === m ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
        >
          {value === m && <motion.span layoutId={`${group}-pill`} transition={reduced ? { duration: 0 } : spring.snappy} className="absolute inset-0 rounded-lg bg-background shadow-sm" />}
          <span className="relative"><Glyph mode={m} active={value === m} /></span>
        </button>
      ))}
    </div>
  );
}
