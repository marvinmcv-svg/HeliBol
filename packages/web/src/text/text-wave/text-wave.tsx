"use client";
import { useState, type ElementType } from "react";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface TextWaveProps {
  children: string;
  as?: ElementType;
  /** "hover" waves on hover/focus, "loop" waves continuously */
  trigger?: "hover" | "loop";
  height?: number;
  className?: string;
}

/** Letters ripple upward one after another, like a stadium wave. */
export function TextWave({ children, as: Tag = "span", trigger = "hover", height = 10, className }: TextWaveProps) {
  const [k, setK] = useState(0);
  const reduced = useReducedMotion();
  const loop = trigger === "loop";
  return (
    <Tag className={cn("inline-block", className)} aria-label={children} onPointerEnter={() => setK((x) => x + 1)} onFocus={() => setK((x) => x + 1)} tabIndex={trigger === "hover" ? 0 : undefined}>
      {Array.from(children).map((ch, i) => (
        <motion.span
          key={`${k}-${i}`}
          aria-hidden
          className="inline-block whitespace-pre"
          initial={false}
          animate={reduced || (!loop && k === 0) ? { y: 0 } : { y: [0, -height, 0] }}
          transition={{ duration: 0.5, delay: i * 0.035, ease: [0.34, 1.56, 0.64, 1], repeat: loop ? Infinity : 0, repeatDelay: loop ? 1.2 : 0 }}
        >
          {ch}
        </motion.span>
      ))}
    </Tag>
  );
}
