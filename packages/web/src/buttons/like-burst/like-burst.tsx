"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface LikeBurstProps {
  liked?: boolean;
  onChange?: (liked: boolean) => void;
  count?: number;
  color?: string;
  className?: string;
}

const PARTICLES = 10;

export function LikeBurst({ liked: controlled, onChange, count, color = "#f43f5e", className }: LikeBurstProps) {
  const [internal, setInternal] = useState(false);
  const [burst, setBurst] = useState(0);
  const liked = controlled ?? internal;
  const reduced = useReducedMotion();

  const toggle = () => {
    const next = !liked;
    if (controlled === undefined) setInternal(next);
    onChange?.(next);
    if (next) setBurst((b) => b + 1);
  };

  const shown = count !== undefined ? count + (controlled === undefined && liked ? 1 : 0) : undefined;

  return (
    <button
      onClick={toggle}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
      className={cn("group relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
    >
      <span className="relative grid size-7 place-items-center">
        <AnimatePresence>
          {liked && !reduced && (
            <motion.span key={`ring-${burst}`} className="absolute inset-0 rounded-full border-2" style={{ borderColor: color }} initial={{ scale: 0.2, opacity: 1 }} animate={{ scale: 1.8, opacity: 0, borderWidth: 0 }} transition={{ duration: 0.5 }} />
          )}
          {liked && !reduced &&
            Array.from({ length: PARTICLES }, (_, i) => {
              const a = (i / PARTICLES) * Math.PI * 2;
              return (
                <motion.span
                  key={`p-${burst}-${i}`}
                  className="absolute size-1.5 rounded-full"
                  style={{ background: i % 2 ? color : "#fbbf24" }}
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{ x: Math.cos(a) * 22, y: Math.sin(a) * 22, scale: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                />
              );
            })}
        </AnimatePresence>
        <motion.svg
          viewBox="0 0 24 24"
          className="relative size-6"
          animate={liked && !reduced ? { scale: [1, 0.6, 1.25, 1] } : { scale: 1 }}
          transition={liked ? { duration: 0.45, times: [0, 0.15, 0.6, 1] } : spring.snappy}
          whileTap={{ scale: 0.85 }}
        >
          <path
            d="M12 21s-7.5-4.6-9.6-9.3C1 8.5 3 4.5 6.9 4.5c2.1 0 3.6 1.2 5.1 3 1.5-1.8 3-3 5.1-3 3.9 0 5.9 4 4.5 7.2C19.5 16.4 12 21 12 21Z"
            fill={liked ? color : "transparent"}
            stroke={liked ? color : "currentColor"}
            strokeWidth="1.8"
            className="transition-[fill,stroke] duration-150"
          />
        </motion.svg>
      </span>
      {shown !== undefined && (
        <span className="relative h-5 overflow-hidden tabular-nums">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={shown} className="block" initial={{ y: liked ? 16 : -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: liked ? -16 : 16, opacity: 0 }} transition={spring.snappy}>
              {shown.toLocaleString()}
            </motion.span>
          </AnimatePresence>
        </span>
      )}
    </button>
  );
}
