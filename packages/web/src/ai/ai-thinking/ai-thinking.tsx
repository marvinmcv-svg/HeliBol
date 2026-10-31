"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

const css = `
.k-think{background:linear-gradient(90deg,color-mix(in oklab,currentColor 45%,transparent) 35%,currentColor 50%,color-mix(in oklab,currentColor 45%,transparent) 65%) 0 0/250% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:k-think 1.8s linear infinite}
@keyframes k-think{from{background-position:100% 0}to{background-position:0 0}}
@media (prefers-reduced-motion:reduce){.k-think{animation:none;-webkit-text-fill-color:currentColor}}`;

/** Reasoning disclosure: the current step shimmers, finished steps tick off, the whole trace collapses into "Thought for Ns". */
export function AiThinking({ steps, stepMs = 1300, className }: { steps: string[]; stepMs?: number; className?: string }) {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(true);
  const reduced = useReducedMotion();
  const done = i >= steps.length;
  useEffect(() => {
    if (done) {
      const t = setTimeout(() => setOpen(false), 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setI((n) => n + 1), stepMs);
    return () => clearTimeout(t);
  }, [i, done, stepMs]);
  return (
    <div className={cn("w-full max-w-md rounded-2xl border border-border bg-card p-3 text-sm", className)}>
      <style href="k-think" precedence="kinetik">{css}</style>
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center gap-2 text-left">
        <span className={cn("font-medium", !done && "k-think")}>{done ? `Thought for ${((steps.length * stepMs) / 1000).toFixed(0)}s` : steps[i]}</span>
        <ChevronDown className={cn("ml-auto size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ol initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2 space-y-1.5 overflow-hidden border-l border-border pl-3" aria-live="polite">
            {steps.slice(0, Math.min(i + 1, steps.length)).map((s, n) => (
              <motion.li key={s} initial={reduced ? false : { opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-muted-foreground">
                {n < i ? <Check className="size-3.5 text-emerald-500" /> : <span className="size-3.5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />}
                <span className={cn(n === i && "text-foreground")}>{s}</span>
              </motion.li>
            ))}
          </motion.ol>
        )}
      </AnimatePresence>
    </div>
  );
}
