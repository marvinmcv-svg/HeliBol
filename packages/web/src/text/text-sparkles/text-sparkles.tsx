"use client";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export interface TextSparklesProps {
  children: ReactNode;
  colors?: string[];
  /** sparkles alive at once */
  count?: number;
  className?: string;
}

let uid = 0;
const DEFAULT_COLORS = ["#facc15", "#a78bfa", "#f472b6"];
const make = (colors: string[]): Sparkle => ({ id: uid++, x: Math.random() * 100, y: Math.random() * 100, size: 8 + Math.random() * 12, color: colors[Math.floor(Math.random() * colors.length)] });

/** Four-point stars twinkle in and out around the text. */
export function TextSparkles({ children, colors = DEFAULT_COLORS, count = 8, className }: TextSparklesProps) {
  const reduced = useReducedMotion();
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  useEffect(() => {
    if (reduced) return setSparkles([]);
    setSparkles(Array.from({ length: count }, () => make(colors)));
    const t = setInterval(() => setSparkles((s) => [...s.slice(1), make(colors)]), 420);
    return () => clearInterval(t);
  }, [reduced, count, colors.join()]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <span className={cn("relative inline-block", className)}>
      <AnimatePresence>
        {sparkles.map((s) => (
          <motion.svg
            key={s.id}
            aria-hidden
            viewBox="0 0 24 24"
            className="pointer-events-none absolute"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, translate: "-50% -50%" }}
            initial={{ scale: 0, rotate: 0, opacity: 0 }}
            animate={{ scale: 1, rotate: 90, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <path d="M12 0C12.8 7.2 16.8 11.2 24 12C16.8 12.8 12.8 16.8 12 24C11.2 16.8 7.2 12.8 0 12C7.2 11.2 11.2 7.2 12 0Z" fill={s.color} />
          </motion.svg>
        ))}
      </AnimatePresence>
      <span className="relative">{children}</span>
    </span>
  );
}
