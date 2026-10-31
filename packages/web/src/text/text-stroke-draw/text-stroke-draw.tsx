"use client";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface TextStrokeDrawProps {
  children: string;
  /** SVG font size in user units */
  fontSize?: number;
  duration?: number;
  className?: string;
}

/** The outline of the word draws itself, then the fill floods in. */
export function TextStrokeDraw({ children, fontSize = 96, duration = 2.2, className }: TextStrokeDrawProps) {
  const reduced = useReducedMotion();
  const width = children.length * fontSize * 0.62;
  return (
    <svg viewBox={`0 0 ${width} ${fontSize * 1.25}`} className={cn("h-auto w-full max-w-full overflow-visible", className)} role="img" aria-label={children}>
      <motion.text
        x="50%"
        y="52%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight={800}
        className="fill-current stroke-current"
        strokeWidth={1.4}
        initial={reduced ? false : { strokeDasharray: 600, strokeDashoffset: 600, fillOpacity: 0 }}
        whileInView={{ strokeDashoffset: 0, fillOpacity: 1 }}
        viewport={{ once: true }}
        transition={{ strokeDashoffset: { duration, ease: [0.65, 0, 0.35, 1] }, fillOpacity: { delay: duration * 0.75, duration: 0.8 } }}
        style={{ letterSpacing: "-0.02em" }}
      >
        {children}
      </motion.text>
    </svg>
  );
}
