"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn, usePrefersTouch, useReducedMotion } from "@kinetik/core";

export interface CursorSnapOutlineProps {
  children: ReactNode;
  /** Selector for elements the cursor should wrap. */
  targets?: string;
  className?: string;
}

/**
 * iPadOS-style pointer: a soft round cursor that, over any interactive element, morphs into a
 * rounded rectangle hugging that element (springs on x, y, width, height and radius) and nudges a
 * little toward the real pointer, so buttons feel magnetic. Pointer devices only.
 */
export function CursorSnapOutline({ children, targets = "a, button, [data-snap]", className }: CursorSnapOutlineProps) {
  const reduced = useReducedMotion();
  const touch = usePrefersTouch();
  const area = useRef<HTMLDivElement>(null);
  const [inside, setInside] = useState(false);
  const [snapped, setSnapped] = useState(false);
  const cfg = reduced ? { stiffness: 3000, damping: 150 } : { stiffness: 420, damping: 34, mass: 0.6 };
  const x = useSpring(useMotionValue(0), cfg), y = useSpring(useMotionValue(0), cfg);
  const w = useSpring(useMotionValue(18), cfg), h = useSpring(useMotionValue(18), cfg);
  const r = useSpring(useMotionValue(9), cfg);

  useEffect(() => {
    const el = area.current;
    if (!el || touch) return;
    const move = (e: PointerEvent) => {
      const box = el.getBoundingClientRect();
      const px = e.clientX - box.left, py = e.clientY - box.top;
      const t = (e.target as HTMLElement).closest<HTMLElement>(targets);
      if (t && el.contains(t)) {
        const tb = t.getBoundingClientRect();
        const cx = tb.left - box.left + tb.width / 2, cy = tb.top - box.top + tb.height / 2;
        // magnetic nudge toward the real pointer
        x.set(cx - tb.width / 2 - 6 + (px - cx) * 0.12);
        y.set(cy - tb.height / 2 - 6 + (py - cy) * 0.12);
        w.set(tb.width + 12);
        h.set(tb.height + 12);
        r.set(Math.min(18, parseFloat(getComputedStyle(t).borderRadius) + 6 || 14));
        setSnapped(true);
      } else {
        x.set(px - 9);
        y.set(py - 9);
        w.set(18);
        h.set(18);
        r.set(9);
        setSnapped(false);
      }
    };
    const enter = () => setInside(true);
    const leave = () => setInside(false);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerenter", enter); el.removeEventListener("pointerleave", leave); };
  }, [touch, targets, x, y, w, h, r]);

  return (
    <div ref={area} className={cn("relative", !touch && "cursor-none [&_*]:cursor-none", className)}>
      {children}
      {!touch && (
        <motion.span
          aria-hidden
          className={cn("pointer-events-none absolute left-0 top-0 z-50 transition-[background-color,opacity] duration-200", snapped ? "bg-foreground/10 ring-1 ring-foreground/20" : "bg-foreground/45 backdrop-blur-sm")}
          style={{ x, y, width: w, height: h, borderRadius: r, opacity: inside ? 1 : 0 }}
        />
      )}
    </div>
  );
}
