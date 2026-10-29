"use client";
import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn, usePrefersTouch, useReducedMotion } from "@kinetik/core";

export interface TiltCardProps {
  children: ReactNode;
  /** Max rotation in degrees. */
  max?: number;
  glare?: boolean;
  className?: string;
}

export function TiltCard({ children, max = 12, glare = true, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const touch = usePrefersTouch();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const cfg = { stiffness: 200, damping: 20, mass: 0.6 };
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), cfg);
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), cfg);
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgb(255 255 255 / .35), transparent 55%)`;
  const off = reduced || touch;

  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        if (off || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
      style={off ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={cn("group relative [transform-style:preserve-3d]", className)}
    >
      {children}
      {glare && !off && <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100" style={{ background: glareBg }} />}
    </motion.div>
  );
}
