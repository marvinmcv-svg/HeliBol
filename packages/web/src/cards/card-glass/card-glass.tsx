"use client";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn, usePrefersTouch, useReducedMotion } from "@kinetik/core";

/** Frosted glass card over a colorful backdrop; backdrop blobs and the card drift in opposite directions with the pointer. */
export function CardGlass({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const off = useReducedMotion() || usePrefersTouch();
  const mx = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });
  const my = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });
  const bx = useTransform(mx, (v) => v * -30);
  const by = useTransform(my, (v) => v * -30);
  const cx = useTransform(mx, (v) => v * 10);
  const cy = useTransform(my, (v) => v * 10);
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        if (off || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => (mx.set(0), my.set(0))}
      className={cn("relative grid place-items-center overflow-hidden", className)}
    >
      <motion.div aria-hidden className="absolute inset-0" style={{ x: bx, y: by }}>
        <div className="absolute top-[15%] left-[18%] size-40 rounded-full bg-fuchsia-500" />
        <div className="absolute right-[15%] bottom-[12%] size-48 rounded-full bg-sky-500" />
        <div className="absolute top-[40%] left-[50%] size-24 rounded-full bg-amber-400" />
      </motion.div>
      <motion.div style={{ x: cx, y: cy }} className="relative rounded-3xl border border-white/30 bg-white/15 p-6 text-white shadow-[0_8px_32px_rgb(0_0_0/.25),inset_0_1px_0_rgb(255_255_255/.4)] backdrop-blur-2xl backdrop-saturate-150">
        {children}
      </motion.div>
    </div>
  );
}
