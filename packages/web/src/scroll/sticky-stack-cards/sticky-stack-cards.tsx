"use client";
import { useRef, type ReactNode, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface StickyStackCardsProps {
  items: ReactNode[];
  container?: RefObject<HTMLElement | null>;
  /** px offset from the top where cards stick; each card adds `step`. */
  top?: number;
  step?: number;
  className?: string;
}

function Card({ children, i, total, progress, top, step, reduced }: { children: ReactNode; i: number; total: number; progress: MotionValue<number>; top: number; step: number; reduced: boolean }) {
  const start = i / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - i - 1) * 0.05]);
  const filter = useTransform(progress, [start, 1], ["brightness(1)", `brightness(${1 - (total - i - 1) * 0.12})`]);
  return (
    <div className="sticky flex h-[70cqh] items-start justify-center" style={{ top: top + i * step }}>
      <motion.div style={reduced ? undefined : { scale, filter }} className="w-full origin-top">
        {children}
      </motion.div>
    </div>
  );
}

export function StickyStackCards({ items, container, top = 24, step = 14, className }: StickyStackCardsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start start", "end end"] });
  return (
    <div ref={ref} className={cn("relative", className)} style={{ height: `${items.length * 70}cqh` }}>
      {items.map((item, i) => (
        <Card key={i} i={i} total={items.length} progress={scrollYProgress} top={top} step={step} reduced={reduced}>
          {item}
        </Card>
      ))}
    </div>
  );
}
