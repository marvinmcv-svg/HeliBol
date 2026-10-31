"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

/** Hydration tracker: a glass fills with a wobbling wave as you log cups; bubbles rise when it changes. */
export function WidgetWater({ goal = 8, className }: { goal?: number; className?: string }) {
  const [cups, setCups] = useState(3);
  const [bump, setBump] = useState(0);
  const reduced = useReducedMotion();
  const pct = Math.min(1, cups / goal);
  const change = (d: number) => {
    setCups((c) => Math.max(0, Math.min(goal, c + d)));
    setBump((b) => b + 1);
  };
  return (
    <div className={cn("flex items-center gap-5 rounded-3xl border border-border bg-card p-5", className)}>
      <div className="relative h-36 w-24 overflow-hidden rounded-b-[2rem] rounded-t-lg border-2 border-sky-300/70 bg-sky-50/40 dark:bg-sky-950/20" role="meter" aria-label="Water today" aria-valuenow={cups} aria-valuemax={goal}>
        <motion.div className="absolute inset-x-0 bottom-0 bg-sky-400/80" initial={false} animate={{ height: `${pct * 100}%` }} transition={{ type: "spring", stiffness: 70, damping: 12 }}>
          <motion.svg viewBox="0 0 120 12" preserveAspectRatio="none" className="absolute -top-2.5 left-0 h-3 w-[200%]" animate={reduced ? {} : { x: ["0%", "-50%"] }} transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}>
            <path d="M0 6 Q15 0 30 6 T60 6 T90 6 T120 6 V12 H0Z" className="fill-sky-400/80" />
          </motion.svg>
          {!reduced && Array.from({ length: 5 }, (_, i) => <motion.span key={`${bump}-${i}`} className="absolute bottom-0 size-1.5 rounded-full bg-white/70" style={{ left: `${15 + i * 17}%` }} initial={{ y: 0, opacity: 1 }} animate={{ y: -120, opacity: 0 }} transition={{ duration: 1.2 + i * 0.15, delay: i * 0.08 }} />)}
        </motion.div>
      </div>
      <div className="space-y-3">
        <div><p className="text-sm text-muted-foreground">Water today</p><p className="text-3xl font-semibold tabular-nums">{cups}<span className="text-base text-muted-foreground">/{goal} cups</span></p></div>
        <div className="flex gap-2">
          <button onClick={() => change(-1)} aria-label="Remove a cup" className="grid size-9 place-items-center rounded-full border border-border hover:bg-accent"><Minus className="size-4" /></button>
          <button onClick={() => change(1)} aria-label="Add a cup" className="grid size-9 place-items-center rounded-full bg-sky-500 text-white"><Plus className="size-4" /></button>
        </div>
      </div>
    </div>
  );
}
