"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { animate, motion, useMotionValue, type PanInfo } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface CarouselDragProps {
  items: ReactNode[];
  /** Slide width as a fraction of the viewport width. */
  slideWidth?: number;
  gap?: number;
  className?: string;
  label?: string;
}

export function CarouselDrag({ items, slideWidth = 0.78, gap = 16, className, label = "Carousel" }: CarouselDragProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [index, setIndex] = useState(0);
  const x = useMotionValue(0);
  const dotId = useId();
  const step = w * slideWidth + gap;

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    if (viewport.current) ro.observe(viewport.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const c = animate(x, -index * step, spring.smooth);
    return () => c.stop();
  }, [index, step, x]);

  const go = (i: number) => setIndex(Math.max(0, Math.min(items.length - 1, i)));

  const onDragEnd = (_: unknown, info: PanInfo) => {
    // project with velocity for an inertial feel, then snap
    const projected = -x.get() - info.velocity.x * 0.2;
    go(Math.round(projected / step));
  };

  return (
    <section aria-roledescription="carousel" aria-label={label} className={cn("relative", className)} onKeyDown={(e) => (e.key === "ArrowRight" ? go(index + 1) : e.key === "ArrowLeft" ? go(index - 1) : null)}>
      <div ref={viewport} className="overflow-hidden">
        <motion.div
          className="flex cursor-grab touch-pan-y active:cursor-grabbing"
          style={{ x, gap }}
          drag="x"
          dragConstraints={{ left: -step * (items.length - 1), right: 0 }}
          dragElastic={0.12}
          onDragEnd={onDragEnd}
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}`}
              className="shrink-0"
              style={{ width: w * slideWidth || `${slideWidth * 100}%` }}
              animate={{ scale: i === index ? 1 : 0.94, opacity: i === index ? 1 : 0.55 }}
              transition={spring.smooth}
            >
              {item}
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          {items.map((_, i) => (
            <button key={i} onClick={() => go(i)} aria-label={`Go to slide ${i + 1}`} aria-current={i === index} className="relative h-1.5 overflow-hidden rounded-full bg-muted-foreground/25 transition-[width] duration-300" style={{ width: i === index ? 24 : 6 }}>
              {i === index && <motion.span layoutId={`${dotId}-dot`} className="absolute inset-0 rounded-full bg-foreground" />}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous slide" className="grid size-9 place-items-center rounded-full border border-border hover:bg-accent disabled:opacity-40"><ChevronLeft className="size-4" /></button>
          <button onClick={() => go(index + 1)} disabled={index === items.length - 1} aria-label="Next slide" className="grid size-9 place-items-center rounded-full border border-border hover:bg-accent disabled:opacity-40"><ChevronRight className="size-4" /></button>
        </div>
      </div>
    </section>
  );
}
