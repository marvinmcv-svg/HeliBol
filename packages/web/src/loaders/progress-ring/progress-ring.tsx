"use client";
import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@kinetik/core";

export interface ProgressRingProps {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export function ProgressRing({ value, size = 120, stroke = 10, label = "Progress", showValue = true, className }: ProgressRingProps) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 90, damping: 20 });
  const offset = useTransform(spring, (v) => 100 - v);
  const text = useTransform(spring, (v) => `${Math.round(v)}%`);
  useEffect(() => mv.set(Math.max(0, Math.min(100, value))), [value, mv]);
  const r = (size - stroke) / 2;
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100} className={cn("relative inline-grid place-items-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-muted" />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round" pathLength={100} strokeDasharray="100" style={{ strokeDashoffset: offset }} stroke="currentColor" />
      </svg>
      {showValue && <motion.span className="absolute text-xl font-semibold tabular-nums">{text}</motion.span>}
    </div>
  );
}
