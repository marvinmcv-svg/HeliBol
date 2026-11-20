"use client";
import { useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface ButtonSlideConfirmProps {
  label?: string;
  doneLabel?: string;
  onConfirm?: () => void;
  /** Track width in px. */
  width?: number;
  className?: string;
}

const KNOB = 52;

/**
 * Slide to confirm (iOS "slide to power off"): drag the knob across — the label fades and a
 * shimmer sweeps the text, the track fills behind the knob, releasing short springs back, reaching
 * the end locks into a green success state. Keyboard: Enter/Space or arrow keys complete it.
 */
export function ButtonSlideConfirm({ label = "Slide to pay", doneLabel = "Paid", onConfirm, width = 300, className }: ButtonSlideConfirmProps) {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);
  const max = width - KNOB - 8;
  const x = useMotionValue(0);
  const fill = useTransform(x, (v) => v + KNOB);
  const textOpacity = useTransform(x, [0, max * 0.6], [1, 0]);
  const knob = useRef<HTMLDivElement>(null);

  const complete = () => {
    if (done) return;
    setDone(true);
    animate(x, max, reduced ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 35 });
    onConfirm?.();
  };

  return (
    <div
      className={cn("relative h-[60px] select-none overflow-hidden rounded-full p-1 transition-colors duration-500", done ? "bg-emerald-500" : "bg-zinc-900", className)}
      style={{ width }}
    >
      <motion.div aria-hidden className={cn("absolute inset-y-1 left-1 rounded-full", done ? "bg-emerald-500" : "bg-zinc-700/60")} style={{ width: fill }} />
      <motion.span aria-hidden style={{ opacity: done ? 0 : textOpacity }} className="kn-slide-shimmer pointer-events-none absolute inset-0 grid place-items-center pl-10 text-sm font-semibold text-white/70">
        <span className="bg-[linear-gradient(110deg,rgb(255_255_255/.45)_35%,#fff_50%,rgb(255_255_255/.45)_65%)] bg-[length:200%_100%] bg-clip-text text-transparent motion-safe:animate-[kn-slide-sheen_2.4s_linear_infinite]">{label}</span>
      </motion.span>
      {done && <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="absolute inset-0 grid place-items-center pr-10 text-sm font-semibold text-white">{doneLabel}</motion.span>}
      <style href="kn-button-slide-confirm" precedence="kinetik">{`@keyframes kn-slide-sheen { from { background-position: 200% 0 } to { background-position: -200% 0 } } [data-reduce-motion] .kn-slide-shimmer span { animation: none !important; }`}</style>
      <motion.div
        ref={knob}
        role="slider"
        tabIndex={done ? -1 : 0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={done ? 100 : 0}
        aria-valuetext={done ? doneLabel : "Not confirmed"}
        drag={done ? false : "x"}
        dragConstraints={{ left: 0, right: max }}
        dragElastic={0.04}
        dragMomentum={false}
        onDragEnd={() => (x.get() > max * 0.85 ? complete() : animate(x, 0, reduced ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 30 }))}
        onKeyDown={(e) => ["Enter", " ", "ArrowRight", "End"].includes(e.key) && (e.preventDefault(), complete())}
        style={{ x, width: KNOB, height: KNOB }}
        whileTap={done || reduced ? undefined : { scale: 0.94 }}
        className="relative z-10 grid cursor-grab place-items-center rounded-full bg-white text-zinc-900 shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
      >
        {done ? <Check className="size-5 text-emerald-600" strokeWidth={3} /> : <ArrowRight className="size-5" />}
      </motion.div>
    </div>
  );
}
