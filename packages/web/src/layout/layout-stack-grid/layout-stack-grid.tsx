"use client";
import { useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface StackGridItem { id: string; src: string; title: string; meta?: string }
export type StackGridMode = "stack" | "grid" | "list";
export interface LayoutStackGridProps {
  items: StackGridItem[];
  defaultMode?: StackGridMode;
  className?: string;
}

const tilt = [-7, 5, -3, 8, -5, 3, -8, 6];

/**
 * One collection, three layouts: a messy stacked deck, a tidy grid and a compact list. Switching
 * animates every card from where it is to where it belongs (shared layout), with a per-card stagger
 * so the deck deals itself out. The segmented control's pill slides too.
 */
export function LayoutStackGrid({ items, defaultMode = "stack", className }: LayoutStackGridProps) {
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<StackGridMode>(defaultMode);
  const t = (i: number) => (reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 260, damping: 26, delay: i * 0.035 });
  return (
    <LayoutGroup>
      <div className={cn("flex flex-col items-center gap-5", className)}>
        <div role="radiogroup" aria-label="Layout" className="relative flex rounded-full bg-muted p-1">
          {(["stack", "grid", "list"] as const).map((m) => (
            <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => setMode(m)} className={cn("relative rounded-full px-4 py-1 text-xs font-medium capitalize", mode === m ? "text-background" : "text-muted-foreground")}>
              {mode === m && <motion.span layoutId="kn-sg-pill" className="absolute inset-0 rounded-full bg-foreground" transition={t(0)} />}
              <span className="relative">{m}</span>
            </button>
          ))}
        </div>
        <div
          className={cn(
            "relative w-full",
            mode === "stack" && "grid h-[300px] place-items-center",
            mode === "grid" && "grid grid-cols-3 gap-3 sm:grid-cols-4",
            mode === "list" && "flex max-w-md flex-col gap-2",
          )}
        >
          {items.map((it, i) => (
            <motion.div
              key={it.id}
              layout
              transition={t(i)}
              className={cn(
                "overflow-hidden bg-card shadow-sm ring-1 ring-border",
                mode === "stack" && "col-start-1 row-start-1 w-44 rounded-2xl p-2 pb-3 shadow-xl",
                mode === "grid" && "rounded-xl",
                mode === "list" && "flex items-center gap-3 rounded-xl p-2",
              )}
              style={{ rotate: mode === "stack" ? tilt[i % tilt.length] : 0, zIndex: mode === "stack" ? items.length - i : 0 }}
            >
              <motion.img layout transition={t(i)} src={it.src} alt="" className={cn("object-cover", mode === "list" ? "size-12 rounded-lg" : "aspect-[4/3] w-full", mode === "stack" && "rounded-xl")} />
              <motion.div layout="position" transition={t(i)} className={cn(mode === "grid" && "p-2", mode === "stack" && "px-1 pt-2")}>
                <p className="text-sm font-medium leading-tight">{it.title}</p>
                {it.meta && mode !== "stack" && <p className="text-xs text-muted-foreground">{it.meta}</p>}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </LayoutGroup>
  );
}
