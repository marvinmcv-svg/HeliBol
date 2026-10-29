"use client";
import { useRef, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface TextScrollHighlightProps {
  children: string;
  /** Scroll container (defaults to the window). */
  container?: RefObject<HTMLElement | null>;
  className?: string;
  /** Opacity of not-yet-read words. */
  dim?: number;
}

function Word({ word, range, progress, dim }: { word: string; range: [number, number]; progress: MotionValue<number>; dim: number }) {
  const opacity = useTransform(progress, range, [dim, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block whitespace-pre">
      {word}
    </motion.span>
  );
}

export function TextScrollHighlight({ children, container, className, dim = 0.15 }: TextScrollHighlightProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start 0.85", "end 0.4"] });
  const words = children.split(" ");

  if (reduced) return <p ref={ref} className={className}>{children}</p>;

  return (
    <p ref={ref} className={cn("flex flex-wrap", className)} aria-label={children}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="relative mr-[0.25em]">
          <Word word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} dim={dim} />
        </span>
      ))}
    </p>
  );
}
