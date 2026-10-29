"use client";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn, usePrefersTouch, useReducedMotion } from "@kinetik/core";
import { springConfig } from "@kinetik/tokens";

export interface ButtonMagneticProps {
  children: ReactNode;
  /** 0–1: how far the button follows the cursor. */
  strength?: number;
  className?: string;
  onClick?: () => void;
}

export function ButtonMagnetic({ children, strength = 0.35, className, onClick }: ButtonMagneticProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const touch = usePrefersTouch();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, springConfig.bouncy);
  const sy = useSpring(y, springConfig.bouncy);
  // label moves a bit further than the button for depth
  const lx = useTransform(sx, (v) => v * 0.4);
  const ly = useTransform(sy, (v) => v * 0.4);
  const off = reduced || touch;

  const onMove = (e: React.PointerEvent) => {
    if (off || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onClick={onClick}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative inline-flex h-14 items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-background outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <motion.span style={{ x: lx, y: ly }} className="inline-flex items-center gap-2">
        {children}
      </motion.span>
    </motion.button>
  );
}
