"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { cn, usePrefersTouch, useReducedMotion } from "@kinetik/core";

export interface CursorContextLabelProps {
  children: ReactNode;
  className?: string;
}

/**
 * A cursor that reads the room: over elements marked `data-cursor="View"` (or "Drag", "Play",
 * "Open ↗"…) the dot morphs into a pill showing that label, takes the element's
 * `data-cursor-color`, and shrinks back to a dot elsewhere. Uses difference blending on plain
 * text so it stays visible on any background. Pointer devices only.
 */
export function CursorContextLabel({ children, className }: CursorContextLabelProps) {
  const reduced = useReducedMotion();
  const touch = usePrefersTouch();
  const area = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [inside, setInside] = useState(false);
  const x = useMotionValue(0), y = useMotionValue(0);
  const cfg = reduced ? { stiffness: 5000, damping: 200 } : { stiffness: 520, damping: 38, mass: 0.5 };
  const sx = useSpring(x, cfg), sy = useSpring(y, cfg);

  useEffect(() => {
    const el = area.current;
    if (!el || touch) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      setLabel(t?.dataset.cursor ?? null);
      setColor(t?.dataset.cursorColor ?? null);
    };
    const enter = () => setInside(true);
    const leave = () => (setInside(false), setLabel(null));
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerenter", enter); el.removeEventListener("pointerleave", leave); };
  }, [touch, x, y]);

  return (
    <div ref={area} className={cn("relative", !touch && "cursor-none [&_*]:cursor-none", className)}>
      {children}
      {!touch && (
        <motion.div aria-hidden className="pointer-events-none absolute left-0 top-0 z-50" style={{ x: sx, y: sy }}>
          <motion.div
            className={cn("flex -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden whitespace-nowrap rounded-full text-xs font-semibold", !color && "bg-white text-black mix-blend-difference")}
            style={color ? { background: color, color: "#000" } : undefined}
            animate={{ width: label ? Math.max(64, label.length * 8 + 28) : 12, height: label ? 64 : 12, opacity: inside ? 1 : 0 }}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 30 }}
          >
            <AnimatePresence mode="popLayout">
              {label && (
                <motion.span key={label} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.15 }}>
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
