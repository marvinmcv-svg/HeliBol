"use client";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface AgentStep {
  icon: ReactNode;
  title: string;
  detail?: string;
  /** ms the step "runs" */
  duration?: number;
}

/** Agent run timeline: tool calls appear one by one with a running spinner, then collapse to a check with their result. */
export function AiAgentSteps({ steps, className }: { steps: AgentStep[]; className?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (i >= steps.length) return;
    const t = setTimeout(() => setI((n) => n + 1), steps[i].duration ?? 1200);
    return () => clearTimeout(t);
  }, [i, steps]);
  return (
    <ol className={cn("relative space-y-3", className)} aria-live="polite">
      <span aria-hidden className="absolute top-3 bottom-3 left-[15px] w-px bg-border" />
      <AnimatePresence initial={false}>
        {steps.slice(0, Math.min(i + 1, steps.length)).map((s, n) => {
          const running = n === i;
          return (
            <motion.li key={s.title} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={spring.smooth} className="relative flex gap-3">
              <span className={cn("relative z-10 grid size-8 shrink-0 place-items-center rounded-full border bg-card transition-colors", running ? "border-violet-500 text-violet-500" : "border-emerald-500/40 bg-emerald-500/10 text-emerald-500")}>
                {running ? <span className="[&>svg]:size-4">{s.icon}</span> : <Check className="size-4" />}
                {running && <span className="absolute inset-0 animate-ping rounded-full border border-violet-500/50" />}
              </span>
              <div className="pt-1 text-sm">
                <p className="font-medium">{s.title}{running && <span className="text-muted-foreground">…</span>}</p>
                <AnimatePresence>{!running && s.detail && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-xs text-muted-foreground">{s.detail}</motion.p>}</AnimatePresence>
              </div>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ol>
  );
}
