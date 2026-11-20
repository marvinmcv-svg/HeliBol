"use client";
import { useRef, useState, type ReactNode } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface LayoutSplitPanesProps {
  left: ReactNode;
  right: ReactNode;
  /** Initial split, 0–1. */
  defaultSplit?: number;
  /** Positions the divider snaps to when released nearby. */
  snaps?: number[];
  min?: number;
  max?: number;
  className?: string;
}

/**
 * Resizable split view with feel: drag the handle and the panes resize live; release near a snap
 * point (⅓, ½, ⅔ by default) and it springs into place with a little overshoot. The handle grows
 * a grip while dragged and shows the current ratio. Keyboard: ←/→ moves 5%, Home/End to the
 * limits, double-click (or Enter) resets.
 */
export function LayoutSplitPanes({ left, right, defaultSplit = 0.5, snaps = [1 / 3, 0.5, 2 / 3], min = 0.2, max = 0.8, className }: LayoutSplitPanesProps) {
  const reduced = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const split = useMotionValue(defaultSplit);
  const [now, setNow] = useState(Math.round(defaultSplit * 100));
  useMotionValueEvent(split, "change", (v) => setNow(Math.round(v * 100)));
  const leftW = useTransform(split, (v) => `${v * 100}%`);
  const label = useTransform(split, (v) => `${Math.round(v * 100)} / ${Math.round((1 - v) * 100)}`);
  const dragging = useMotionValue(0);
  const gripH = useTransform(dragging, [0, 1], [28, 56]);
  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  const go = (v: number) => (reduced ? split.set(clamp(v)) : animate(split, clamp(v), { type: "spring", stiffness: 380, damping: 22 }));
  const release = () => {
    dragging.set(0);
    const v = split.get();
    const near = snaps.reduce((a, s) => (Math.abs(s - v) < Math.abs(a - v) ? s : a), snaps[0] ?? v);
    if (Math.abs(near - v) < 0.06) go(near);
  };

  return (
    <div ref={box} className={cn("relative flex h-full overflow-hidden rounded-2xl border bg-card", className)}>
      <motion.div className="relative h-full min-w-0 overflow-hidden" style={{ width: leftW }}>{left}</motion.div>
      <div
        role="separator"
        aria-orientation="vertical"
        aria-valuemin={min * 100}
        aria-valuemax={max * 100}
        aria-valuenow={now}
        aria-label="Resize panes"
        tabIndex={0}
        className="group relative z-10 w-3 shrink-0 cursor-col-resize touch-none outline-none"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          dragging.set(1);
        }}
        onPointerMove={(e) => {
          if (!dragging.get()) return;
          const b = box.current!.getBoundingClientRect();
          split.set(clamp((e.clientX - b.left) / b.width));
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onDoubleClick={() => go(defaultSplit)}
        onKeyDown={(e) => {
          const k = e.key;
          if (k === "ArrowLeft" || k === "ArrowRight") (e.preventDefault(), go(split.get() + (k === "ArrowLeft" ? -0.05 : 0.05)));
          else if (k === "Home") go(min);
          else if (k === "End") go(max);
          else if (k === "Enter") go(defaultSplit);
        }}
      >
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border" />
        <motion.span style={{ height: gripH }} className="absolute left-1/2 top-1/2 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/70 ring-4 ring-card transition-colors group-hover:bg-foreground group-focus-visible:bg-sky-500" />
        <motion.span className="pointer-events-none absolute left-1/2 top-[calc(50%+40px)] -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-2 py-0.5 font-mono text-[10px] text-background opacity-0 transition-opacity group-active:opacity-100 group-focus-visible:opacity-100">{label}</motion.span>
      </div>
      <div className="relative h-full min-w-0 flex-1 overflow-hidden">{right}</div>
    </div>
  );
}
