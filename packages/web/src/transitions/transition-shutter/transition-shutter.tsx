"use client";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface TransitionShutterProps {
  /** Pages to switch between; the key decides which is shown. */
  pages: { key: string; label: string; content: ReactNode }[];
  /** Number of shutter blades. */
  blades?: number;
  color?: string;
  className?: string;
}

/**
 * Page transition with venetian shutters: blades close top-to-bottom (scaleY from the top), the page
 * swaps while covered, then blades open bottom-to-top with a stagger, revealing the new page. The
 * route name flashes on the closed shutter. Reduced motion: a quick crossfade.
 */
export function TransitionShutter({ pages, blades = 7, color = "#0a0a0a", className }: TransitionShutterProps) {
  const reduced = useReducedMotion();
  const [current, setCurrent] = useState(pages[0].key);
  const [shown, setShown] = useState(pages[0].key);
  const [phase, setPhase] = useState<"idle" | "closing" | "opening">("idle");
  const busy = phase !== "idle";
  const ease = [0.76, 0, 0.24, 1] as const;

  const go = (key: string) => {
    if (busy || key === current) return;
    setCurrent(key);
    if (reduced) return setShown(key);
    setPhase("closing");
  };
  const page = pages.find((p) => p.key === shown)!;

  return (
    <div className={cn("relative flex h-full flex-col overflow-hidden", className)}>
      <nav aria-label="Pages" className="relative z-30 flex gap-1 border-b border-border bg-background/80 p-2 backdrop-blur">
        {pages.map((p) => (
          <button key={p.key} type="button" aria-current={p.key === current ? "page" : undefined} onClick={() => go(p.key)} className={cn("rounded-lg px-3 py-1.5 text-sm transition-colors", p.key === current ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}>
            {p.label}
          </button>
        ))}
      </nav>
      <div className="relative flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={shown} className="absolute inset-0 overflow-auto" initial={reduced ? { opacity: 0 } : false} animate={{ opacity: 1 }} exit={reduced ? { opacity: 0 } : undefined} transition={{ duration: 0.2 }}>
            {page.content}
          </motion.div>
        </AnimatePresence>
        {busy && (
          <div aria-hidden className="pointer-events-none absolute inset-0 z-20 flex flex-col">
            {Array.from({ length: blades }, (_, i) => (
              <motion.div
                key={i}
                className="flex-1"
                style={{ background: color, transformOrigin: phase === "closing" ? "top" : "bottom" }}
                initial={{ scaleY: phase === "closing" ? 0 : 1.02 }}
                animate={{ scaleY: phase === "closing" ? 1.02 : 0 }}
                transition={{ duration: 0.45, ease, delay: (phase === "closing" ? i : blades - 1 - i) * 0.045 }}
                onAnimationComplete={() => {
                  if (i !== (phase === "closing" ? blades - 1 : 0)) return;
                  if (phase === "closing") (setShown(current), setPhase("opening"));
                  else setPhase("idle");
                }}
              />
            ))}
            <motion.p
              className="absolute inset-0 grid place-items-center text-4xl font-semibold tracking-tight text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "closing" ? [0, 0, 1] : 0 }}
              transition={{ duration: phase === "closing" ? 0.7 : 0.15 }}
            >
              {pages.find((p) => p.key === current)?.label}
            </motion.p>
          </div>
        )}
      </div>
    </div>
  );
}
