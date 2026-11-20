"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface NavStretchTabsProps {
  tabs: string[];
  defaultIndex?: number;
  onChange?: (i: number) => void;
  className?: string;
}

/**
 * Tabs whose indicator moves like a caterpillar: the leading edge springs out toward the new tab
 * first while the trailing edge lags and then catches up, so the pill stretches across the gap and
 * snaps back — two independently timed edges instead of one sliding box. Arrow keys move between tabs.
 */
export function NavStretchTabs({ tabs, defaultIndex = 0, onChange, className }: NavStretchTabsProps) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(defaultIndex);
  const list = useRef<HTMLDivElement>(null);
  const left = useMotionValue(0), right = useMotionValue(0);
  const width = useWidth(left, right);
  const first = useRef(true);

  useLayoutEffect(() => {
    const el = list.current?.children[active] as HTMLElement | undefined;
    if (!el) return;
    const l = el.offsetLeft, r = el.offsetLeft + el.offsetWidth;
    if (first.current || reduced) {
      left.set(l);
      right.set(r);
      first.current = false;
      return;
    }
    const goingRight = l > left.get();
    const lead = { type: "spring" as const, stiffness: 520, damping: 34 };
    const trail = { type: "spring" as const, stiffness: 260, damping: 26, delay: 0.07 };
    const a = animate(left, l, goingRight ? trail : lead);
    const b = animate(right, r, goingRight ? lead : trail);
    return () => (a.stop(), b.stop());
  }, [active, reduced, left, right]);

  const select = (i: number) => (setActive(i), onChange?.(i));
  return (
    <div className={cn("relative inline-flex rounded-full bg-muted p-1", className)}>
      <motion.span aria-hidden className="absolute bottom-1 top-1 rounded-full bg-foreground shadow" style={{ left, width }} />
      <div ref={list} role="tablist" className="relative flex">
        {tabs.map((t, i) => (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            onClick={() => select(i)}
            onKeyDown={(e) => {
              const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
              if (!d) return;
              const n = (i + d + tabs.length) % tabs.length;
              select(n);
              (e.currentTarget.parentElement?.children[n] as HTMLElement)?.focus();
            }}
            className={cn("relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", i === active ? "text-background" : "text-muted-foreground hover:text-foreground")}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

function useWidth(left: ReturnType<typeof useMotionValue<number>>, right: ReturnType<typeof useMotionValue<number>>) {
  const w = useMotionValue(0);
  useLayoutEffect(() => {
    const update = () => w.set(Math.max(0, right.get() - left.get()));
    update();
    const u1 = left.on("change", update), u2 = right.on("change", update);
    return () => (u1(), u2());
  }, [left, right, w]);
  return w;
}
