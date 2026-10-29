"use client";
import { motion } from "motion/react";
import type { ElementType } from "react";
import { cn, useReducedMotion } from "@kinetik/core";
import { blur, durationS, easeBezier, stagger as staggerTokens } from "@kinetik/tokens";

export interface TextBlurInProps {
  children: string;
  as?: ElementType;
  by?: "words" | "chars";
  delay?: number;
  duration?: number;
  stagger?: number;
  once?: boolean;
  className?: string;
}

export function TextBlurIn({
  children,
  as: Tag = "p",
  by = "words",
  delay = 0,
  duration = durationS.slow,
  stagger,
  once = true,
  className,
}: TextBlurInProps) {
  const reduced = useReducedMotion();
  const parts = by === "words" ? children.split(/(\s+)/) : Array.from(children);
  const step = stagger ?? (by === "words" ? staggerTokens.base : staggerTokens.tight);

  return (
    <Tag className={cn(className)} aria-label={children}>
      <motion.span
        aria-hidden
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: 0.5 }}
        transition={{ staggerChildren: step, delayChildren: delay }}
      >
        {parts.map((part, i) =>
          /^\s+$/.test(part) ? (
            <span key={i}>{part}</span>
          ) : (
            <motion.span
              key={i}
              className="inline-block whitespace-pre will-change-[transform,filter,opacity]"
              variants={{
                hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 8, filter: `blur(${blur.in}px)` },
                visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration, ease: easeBezier.expoOut } },
              }}
            >
              {part}
            </motion.span>
          ),
        )}
      </motion.span>
    </Tag>
  );
}
