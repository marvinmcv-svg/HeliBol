"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface PlanStep {
  id: string;
  title: string;
  /** Sub-tasks that branch out of this step. */
  children?: { id: string; title: string }[];
}

export interface AiPlanGraphProps {
  goal: string;
  steps: PlanStep[];
  /** ms per sub-task. */
  speed?: number;
  className?: string;
}

/**
 * An agent's plan as a growing tree: the goal sits at the top, steps unfold one at a time with a
 * connector line drawing down to each, each step branches into sub-tasks that spin then tick, and a
 * finished step collapses its branches into a summary count. Status is announced as it progresses.
 */
export function AiPlanGraph({ goal, steps, speed = 650, className }: AiPlanGraphProps) {
  const reduced = useReducedMotion();
  const flat = steps.flatMap((s) => [s.id, ...(s.children ?? []).map((c) => c.id)]);
  const [done, setDone] = useState(reduced ? flat.length : 0);

  useEffect(() => {
    if (reduced || done >= flat.length) return;
    const id = setTimeout(() => setDone((d) => d + 1), speed);
    return () => clearTimeout(id);
  }, [done, flat.length, speed, reduced]);

  const idx = (id: string) => flat.indexOf(id);
  const status = (id: string) => (idx(id) < done ? "done" : idx(id) === done ? "active" : "todo");
  const stepComplete = (s: PlanStep) => (s.children ?? []).every((c) => status(c.id) === "done") && status(s.id) === "done";
  const visibleSteps = steps.filter((s) => idx(s.id) <= done);

  const Dot = ({ st }: { st: string }) => (
    <span className={cn("grid size-5 shrink-0 place-items-center rounded-full", st === "done" ? "bg-emerald-500 text-white" : st === "active" ? "bg-primary/15 text-primary" : "bg-muted")}>
      {st === "done" ? <Check className="size-3" strokeWidth={3} /> : st === "active" ? <Loader2 className="size-3 animate-spin motion-reduce:animate-none" /> : null}
    </span>
  );

  return (
    <div className={cn("w-full max-w-md rounded-3xl border border-border bg-card p-5 text-sm", className)}>
      <div className="flex items-center gap-2 rounded-2xl bg-muted px-3 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Goal</span>
        <span className="font-medium">{goal}</span>
      </div>
      <p className="sr-only" aria-live="polite">{done >= flat.length ? "Plan complete" : `Working on step ${visibleSteps.length} of ${steps.length}`}</p>
      <ol className="relative mt-2 pl-4">
        <AnimatePresence initial={false}>
          {visibleSteps.map((s) => {
            const complete = stepComplete(s);
            return (
              <motion.li key={s.id} layout={!reduced} initial={reduced ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="relative pt-3">
                <motion.span aria-hidden className="absolute -left-[9px] top-0 w-px bg-border" initial={reduced ? false : { height: 0 }} animate={{ height: "100%" }} transition={{ duration: 0.4 }} />
                <span aria-hidden className="absolute -left-[9px] top-[1.35rem] h-px w-3 bg-border" />
                <div className="flex items-center gap-2">
                  <Dot st={complete ? "done" : status(s.id) === "todo" ? "todo" : "active"} />
                  <span className="font-medium">{s.title}</span>
                  {complete && s.children?.length ? <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="ml-auto rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] text-emerald-600 dark:text-emerald-400">{s.children.length} done</motion.span> : null}
                </div>
                <AnimatePresence initial={false}>
                  {!complete && s.children && (
                    <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : 0.3 }} className="ml-2.5 overflow-hidden border-l border-dashed border-border pl-4">
                      {s.children.filter((c) => idx(c.id) <= done).map((c) => (
                        <motion.li key={c.id} initial={reduced ? false : { opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 py-1 text-muted-foreground">
                          <Dot st={status(c.id)} />
                          <span className={cn(status(c.id) === "done" && "text-foreground")}>{c.title}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>
    </div>
  );
}
