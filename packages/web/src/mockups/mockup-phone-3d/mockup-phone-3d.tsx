"use client";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn, usePrefersTouch, useReducedMotion } from "@kinetik/core";

export interface MockupPhone3DProps {
  /** Screen content. */
  children: ReactNode;
  /** Resting rotation (deg) — a slight three-quarter view reads as "3D". */
  restY?: number;
  restX?: number;
  className?: string;
}

const W = 240, H = 500, D = 18; // px: width, height, depth

/**
 * A real 3D phone in CSS (front, back and four sides with depth), resting at a three-quarter angle
 * and turning toward the pointer with a spring; a moving glare sweeps the glass as it turns and the
 * shadow underneath shifts. Any React content renders live on the screen.
 */
export function MockupPhone3D({ children, restY = -22, restX = 8, className }: MockupPhone3DProps) {
  const reduced = useReducedMotion();
  const touch = usePrefersTouch();
  const box = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(restX), { stiffness: 90, damping: 16 });
  const ry = useSpring(useMotionValue(restY), { stiffness: 90, damping: 16 });
  const glare = useTransform(ry, [-40, 40], ["-60%", "160%"]);
  const shadowX = useTransform(ry, [-40, 40], [30, -30]);

  return (
    <div
      ref={box}
      className={cn("relative grid place-items-center", className)}
      style={{ perspective: 1400, width: W + 120, height: H + 80 }}
      onPointerMove={(e) => {
        if (reduced || touch) return;
        const r = box.current!.getBoundingClientRect();
        ry.set(restY + ((e.clientX - r.left) / r.width - 0.5) * 50);
        rx.set(restX - ((e.clientY - r.top) / r.height - 0.5) * 24);
      }}
      onPointerLeave={() => (ry.set(restY), rx.set(restX))}
    >
      <motion.span aria-hidden className="absolute bottom-2 h-6 w-48 rounded-[50%] bg-black/45 blur-xl" style={{ x: shadowX }} />
      <motion.div className="relative" style={{ width: W, height: H, transformStyle: "preserve-3d", rotateX: rx, rotateY: ry }}>
        {/* sides */}
        <span aria-hidden className="absolute left-0 top-0 h-full rounded-[2rem] bg-zinc-700" style={{ width: D, transform: `rotateY(-90deg) translateZ(${0}px)`, transformOrigin: "left" }} />
        <span aria-hidden className="absolute right-0 top-0 h-full rounded-[2rem] bg-zinc-600" style={{ width: D, transform: `rotateY(90deg)`, transformOrigin: "right" }} />
        <span aria-hidden className="absolute left-6 right-6 top-0 bg-zinc-600" style={{ height: D, transform: "rotateX(90deg)", transformOrigin: "top" }} />
        <span aria-hidden className="absolute bottom-0 left-6 right-6 bg-zinc-800" style={{ height: D, transform: "rotateX(-90deg)", transformOrigin: "bottom" }} />
        {/* back */}
        <span aria-hidden className="absolute inset-0 rounded-[2.4rem] bg-gradient-to-br from-zinc-600 to-zinc-800" style={{ transform: `translateZ(${-D}px) rotateY(180deg)` }}>
          <span className="absolute left-5 top-5 size-16 rounded-2xl bg-zinc-900/70 ring-1 ring-zinc-500" />
        </span>
        {/* front */}
        <div className="absolute inset-0 overflow-hidden rounded-[2.4rem] bg-black p-[9px] shadow-[inset_0_0_0_2px_rgb(120_120_130)]" style={{ transform: "translateZ(0.5px)" }}>
          <div className="relative size-full overflow-hidden rounded-[1.9rem] bg-background">
            {children}
            <span aria-hidden className="pointer-events-none absolute left-1/2 top-2.5 h-6 w-20 -translate-x-1/2 rounded-full bg-black" />
            {!reduced && <motion.span aria-hidden className="pointer-events-none absolute -top-1/4 h-[150%] w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/25 to-transparent" style={{ left: glare }} />}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
