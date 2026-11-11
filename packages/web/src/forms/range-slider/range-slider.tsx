"use client";
import { useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export interface RangeSliderProps {
  value: [number, number];
  onChange: (v: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Optional histogram (any length) drawn behind the track; bars inside the range light up. */
  histogram?: number[];
  label: string;
  format?: (v: number) => string;
  className?: string;
}

/**
 * Dual-thumb range slider with a live histogram: bars inside the range light up, the active thumb
 * grows and shows a value bubble, thumbs can't cross, and each thumb is a full ARIA slider.
 */
export function RangeSlider({ value, onChange, min = 0, max = 100, step = 1, histogram, label, format = String, className }: RangeSliderProps) {
  const reduced = useReducedMotion();
  const id = useId();
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<0 | 1 | null>(null);
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const snap = (v: number) => Math.min(max, Math.max(min, Math.round((v - min) / step) * step + min));

  const set = (i: 0 | 1, v: number) => {
    const next: [number, number] = [...value];
    next[i] = i === 0 ? Math.min(snap(v), value[1]) : Math.max(snap(v), value[0]);
    if (next[0] !== value[0] || next[1] !== value[1]) onChange(next);
  };
  const fromPointer = (x: number) => {
    const r = track.current!.getBoundingClientRect();
    return min + ((x - r.left) / r.width) * (max - min);
  };

  return (
    <div className={cn("w-full select-none", className)}>
      <div className="mb-3 flex items-baseline justify-between">
        <span id={`${id}-l`} className="text-sm font-medium">{label}</span>
        <span className="text-sm tabular-nums text-muted-foreground">{format(value[0])} – {format(value[1])}</span>
      </div>
      {histogram && (
        <div aria-hidden className="flex h-14 items-end gap-px px-2.5">
          {histogram.map((h, i) => {
            const v = min + ((i + 0.5) / histogram.length) * (max - min);
            const on = v >= value[0] && v <= value[1];
            return <motion.span key={i} className="flex-1 rounded-t-sm" initial={false} animate={{ backgroundColor: on ? "var(--color-primary, #6366f1)" : "var(--color-muted, #e4e4e7)", scaleY: on ? 1 : 0.85 }} transition={reduced ? { duration: 0 } : { duration: 0.25 }} style={{ height: `${(h / Math.max(...histogram)) * 100}%`, transformOrigin: "bottom" }} />;
          })}
        </div>
      )}
      <div
        ref={track}
        className="relative mx-2.5 h-6 touch-none"
        onPointerDown={(e) => {
          const v = fromPointer(e.clientX);
          const i: 0 | 1 = Math.abs(v - value[0]) <= Math.abs(v - value[1]) ? 0 : 1;
          setActive(i);
          set(i, v);
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          (e.currentTarget.querySelectorAll('[role="slider"]')[i] as HTMLElement).focus();
        }}
        onPointerMove={(e) => active !== null && set(active, fromPointer(e.clientX))}
        onPointerUp={() => setActive(null)}
      >
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-muted" />
        <div className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary" style={{ left: `${pct(value[0])}%`, right: `${100 - pct(value[1])}%` }} />
        {([0, 1] as const).map((i) => (
          <div
            key={i}
            role="slider"
            tabIndex={0}
            aria-label={`${label} ${i === 0 ? "minimum" : "maximum"}`}
            aria-valuemin={i === 0 ? min : value[0]}
            aria-valuemax={i === 0 ? value[1] : max}
            aria-valuenow={value[i]}
            aria-valuetext={format(value[i])}
            onKeyDown={(e) => {
              const big = step * 10;
              const d = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step, PageUp: big, PageDown: -big }[e.key];
              if (d) { e.preventDefault(); set(i, value[i] + d); }
              if (e.key === "Home") (e.preventDefault(), set(i, min));
              if (e.key === "End") (e.preventDefault(), set(i, max));
            }}
            onFocus={() => setActive((a) => a ?? i)}
            onBlur={() => setActive(null)}
            className="absolute top-1/2 -ml-2.5 -mt-2.5 size-5 rounded-full outline-none"
            style={{ left: `${pct(value[i])}%` }}
          >
            <motion.span animate={{ scale: active === i && !reduced ? 1.25 : 1 }} transition={reduced ? { duration: 0 } : spring.bouncy} className="block size-full rounded-full border-2 border-primary bg-background shadow-md ring-ring [[role=slider]:focus-visible>&]:ring-2" />
            {active === i && (
              <motion.span initial={reduced ? false : { opacity: 0, y: 4, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={spring.snappy} className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-0.5 text-xs font-medium tabular-nums text-background">
                {format(value[i])}
              </motion.span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
