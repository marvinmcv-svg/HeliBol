"use client";
import { useRef, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import { cn } from "@kinetik/core";

/** Range slider that stretches like rubber when dragged past its ends and springs back; arrow keys and Home/End supported. */
export function SliderElastic({ min = 0, max = 100, defaultValue = 40, label = "Volume", onChange, className }: { min?: number; max?: number; defaultValue?: number; label?: string; onChange?: (v: number) => void; className?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(defaultValue);
  const overflow = useMotionValue(0);
  const scaleX = useTransform(overflow, (o) => 1 + Math.abs(o) / 400);
  const originX = useTransform(overflow, (o) => (o < 0 ? 1 : 0));
  useMotionValueEvent(overflow, "change", () => {});
  const set = (v: number) => {
    const c = Math.round(Math.max(min, Math.min(max, v)));
    setValue(c);
    onChange?.(c);
  };
  const fromX = (x: number) => {
    const r = track.current!.getBoundingClientRect();
    const raw = x - r.left;
    overflow.set(raw < 0 ? Math.max(-60, raw) * 0.5 : raw > r.width ? Math.min(60, raw - r.width) * 0.5 : 0);
    set(min + (Math.max(0, Math.min(r.width, raw)) / r.width) * (max - min));
  };
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn("w-72", className)}>
      <div className="mb-2 flex justify-between text-sm"><span>{label}</span><span className="text-muted-foreground tabular-nums">{value}</span></div>
      <motion.div
        ref={track}
        style={{ scaleX, originX }}
        className="relative h-3 touch-none rounded-full bg-muted"
        onPointerDown={(e) => (e.currentTarget.setPointerCapture(e.pointerId), fromX(e.clientX))}
        onPointerMove={(e) => e.buttons && fromX(e.clientX)}
        onPointerUp={() => animate(overflow, 0, { type: "spring", stiffness: 500, damping: 18 })}
      >
        <div className="absolute inset-y-0 left-0 rounded-full bg-foreground" style={{ width: `${pct}%` }} />
        <div
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          onKeyDown={(e) => {
            const step = e.shiftKey ? 10 : 1;
            if (e.key === "ArrowRight" || e.key === "ArrowUp") (e.preventDefault(), set(value + step));
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") (e.preventDefault(), set(value - step));
            if (e.key === "Home") set(min);
            if (e.key === "End") set(max);
          }}
          className="absolute top-1/2 size-6 -translate-1/2 rounded-full border-2 border-foreground bg-background shadow-md outline-none transition-transform active:scale-110 focus-visible:ring-4 focus-visible:ring-ring/40"
          style={{ left: `${pct}%` }}
        />
      </motion.div>
    </div>
  );
}
