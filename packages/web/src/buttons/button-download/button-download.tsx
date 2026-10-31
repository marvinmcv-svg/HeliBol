"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface ButtonDownloadProps {
  /** Return a promise; progress is simulated unless you pass `progress`. */
  onDownload?: () => Promise<unknown>;
  progress?: number;
  className?: string;
}

/** Download button that shrinks into a circular progress ring, then pops a check. */
export function ButtonDownload({ onDownload, progress: controlled, className }: ButtonDownloadProps) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [p, setP] = useState(0);
  const progress = controlled ?? p;

  useEffect(() => {
    if (state !== "loading" || controlled !== undefined) return;
    const t = setInterval(() => setP((x) => Math.min(100, x + 4 + Math.random() * 10)), 120);
    return () => clearInterval(t);
  }, [state, controlled]);
  useEffect(() => {
    if (state === "loading" && progress >= 100) {
      setState("done");
      const t = setTimeout(() => {
        setState("idle");
        setP(0);
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [progress, state]);

  return (
    <motion.button
      layout
      transition={spring.smooth}
      onClick={() => {
        if (state !== "idle") return;
        setState("loading");
        onDownload?.();
      }}
      aria-label={state === "loading" ? `Downloading ${Math.round(progress)}%` : state === "done" ? "Downloaded" : "Download"}
      aria-live="polite"
      className={cn("relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-foreground text-sm font-medium text-background outline-none focus-visible:ring-2 focus-visible:ring-ring", state === "idle" ? "px-6" : "w-12", state === "done" && "bg-emerald-500 text-white", className)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {state === "idle" && <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-2">↓ Download report</motion.span>}
        {state === "loading" && (
          <motion.svg key="l" viewBox="0 0 36 36" className="size-8 -rotate-90" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeOpacity=".2" strokeWidth="3" />
            <motion.circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" pathLength={1} animate={{ pathLength: progress / 100 }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
          </motion.svg>
        )}
        {state === "done" && (
          <motion.svg key="d" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={spring.bouncy}>
            <motion.path d="M5 12.5l4.5 4.5L19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
