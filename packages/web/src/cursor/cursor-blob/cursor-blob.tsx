"use client";
import { useId, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn, usePrefersTouch, useReducedMotion } from "@kinetik/core";

/** Three gooey blobs chase the cursor at different lags and fuse into one liquid shape (SVG goo filter). */
export function CursorBlob({ children, color = "#8b5cf6", className }: { children?: ReactNode; color?: string; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const off = useReducedMotion() || usePrefersTouch();
  const id = `k-blob-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springs = [
    { s: 0.6, cfg: { stiffness: 400, damping: 30 } },
    { s: 0.45, cfg: { stiffness: 160, damping: 22 } },
    { s: 0.3, cfg: { stiffness: 80, damping: 18 } },
  ];
  const sx = springs.map((b) => useSpring(x, b.cfg)); // eslint-disable-line react-hooks/rules-of-hooks
  const sy = springs.map((b) => useSpring(y, b.cfg)); // eslint-disable-line react-hooks/rules-of-hooks
  return (
    <div
      ref={box}
      onPointerMove={(e) => {
        if (off || !box.current) return;
        const r = box.current.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      className={cn("relative isolate overflow-hidden", className)}
    >
      <svg className="absolute h-0 w-0" aria-hidden>
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
          <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 30 -12" />
        </filter>
      </svg>
      {!off && (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ filter: `url(#${id})` }}>
          {springs.map((b, i) => (
            <motion.div key={i} className="absolute top-0 left-0 rounded-full" style={{ x: sx[i], y: sy[i], width: 120 * b.s * 2, height: 120 * b.s * 2, translateX: "-50%", translateY: "-50%", background: color }} />
          ))}
        </div>
      )}
      {children}
    </div>
  );
}
