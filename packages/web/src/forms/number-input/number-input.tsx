"use client";
import { useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export interface NumberInputProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
  /** Formats the displayed value (e.g. currency). */
  format?: (v: number) => string;
  className?: string;
}

/**
 * A stepper whose digits roll in the direction of change (up for +, down for −), buttons repeat when
 * held, and the field shakes when you hit a limit. Implements the ARIA spinbutton pattern.
 */
export function NumberInput({ value, onChange, min = -Infinity, max = Infinity, step = 1, label, format = String, className }: NumberInputProps) {
  const reduced = useReducedMotion();
  const id = useId();
  const [dir, setDir] = useState(1);
  const [shake, setShake] = useState(0);
  const hold = useRef<ReturnType<typeof setTimeout>>(undefined);
  const latest = useRef(value);
  latest.current = value;

  const bump = (d: 1 | -1) => {
    const next = latest.current + d * step;
    if (next < min || next > max) { setShake((s) => s + 1); return false; }
    setDir(d);
    latest.current = next;
    onChange(next);
    return true;
  };
  const startHold = (d: 1 | -1) => {
    if (!bump(d)) return;
    let delay = 380;
    const loop = () => { if (bump(d)) { delay = Math.max(50, delay * 0.8); hold.current = setTimeout(loop, delay); } };
    hold.current = setTimeout(loop, delay);
  };
  const stop = () => clearTimeout(hold.current);

  const btn = (d: 1 | -1) => (
    <motion.button
      type="button"
      tabIndex={-1}
      aria-label={d > 0 ? "Increase" : "Decrease"}
      disabled={d > 0 ? value >= max : value <= min}
      onPointerDown={() => startHold(d)}
      onPointerUp={stop}
      onPointerLeave={stop}
      whileTap={reduced ? undefined : { scale: 0.85 }}
      className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
    >
      {d > 0 ? <Plus className="size-4" /> : <Minus className="size-4" />}
    </motion.button>
  );

  return (
    <div className={cn("inline-flex flex-col gap-1", className)}>
      <span id={`${id}-l`} className="text-sm font-medium">{label}</span>
      <motion.div
        key={shake}
        animate={shake && !reduced ? { x: [0, -6, 6, -4, 4, 0] } : undefined}
        transition={{ duration: 0.35 }}
        className="flex items-center gap-1 rounded-xl border border-border bg-background p-1 shadow-sm"
      >
        {btn(-1)}
        <div
          role="spinbutton"
          tabIndex={0}
          aria-labelledby={`${id}-l`}
          aria-valuenow={value}
          aria-valuemin={Number.isFinite(min) ? min : undefined}
          aria-valuemax={Number.isFinite(max) ? max : undefined}
          aria-valuetext={format(value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") (e.preventDefault(), bump(1));
            if (e.key === "ArrowDown") (e.preventDefault(), bump(-1));
            if (e.key === "Home" && Number.isFinite(min)) (e.preventDefault(), setDir(-1), onChange(min));
            if (e.key === "End" && Number.isFinite(max)) (e.preventDefault(), setDir(1), onChange(max));
          }}
          className="relative grid h-9 min-w-16 place-items-center overflow-hidden rounded-md px-2 text-lg font-semibold tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <AnimatePresence mode="popLayout" initial={false} custom={dir}>
            <motion.span
              key={value}
              custom={dir}
              variants={{ enter: (d: number) => ({ y: reduced ? 0 : d * 18, opacity: 0 }), center: { y: 0, opacity: 1 }, exit: (d: number) => ({ y: reduced ? 0 : d * -18, opacity: 0 }) }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={reduced ? { duration: 0.08 } : spring.snappy}
            >
              {format(value)}
            </motion.span>
          </AnimatePresence>
        </div>
        {btn(1)}
      </motion.div>
    </div>
  );
}
