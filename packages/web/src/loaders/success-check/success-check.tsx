"use client";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface SuccessCheckProps {
  status: "success" | "error";
  size?: number;
  className?: string;
}

export function SuccessCheck({ status, size = 72, className }: SuccessCheckProps) {
  const reduced = useReducedMotion();
  const color = status === "success" ? "#10b981" : "#ef4444";
  const draw = (delay: number) => (reduced ? { duration: 0 } : { duration: 0.4, delay, ease: [0.65, 0, 0.35, 1] as const });
  return (
    <motion.svg
      key={status}
      role="img"
      aria-label={status === "success" ? "Success" : "Error"}
      viewBox="0 0 52 52"
      width={size}
      height={size}
      className={cn(className)}
      initial={reduced ? false : { scale: 0.8 }}
      animate={{ scale: [0.8, 1.08, 1] }}
      transition={{ duration: 0.5, delay: 0.55, times: [0, 0.5, 1] }}
    >
      <motion.circle cx="26" cy="26" r="24" fill="none" stroke={color} strokeWidth="2.5" initial={{ pathLength: 0, rotate: -90 }} animate={{ pathLength: 1 }} transition={draw(0)} style={{ originX: "50%", originY: "50%" }} />
      <motion.circle cx="26" cy="26" r="24" fill={color} initial={{ opacity: 0 }} animate={{ opacity: 0.12 }} transition={{ delay: reduced ? 0 : 0.4 }} />
      {status === "success" ? (
        <motion.path d="M15 27l7 7 15-16" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={draw(0.35)} />
      ) : (
        <>
          <motion.path d="M18 18l16 16" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={draw(0.35)} />
          <motion.path d="M34 18L18 34" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={draw(0.5)} />
        </>
      )}
    </motion.svg>
  );
}
