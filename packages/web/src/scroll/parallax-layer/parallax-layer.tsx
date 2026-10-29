"use client";
import { useRef, type ReactNode, type RefObject } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface ParallaxLayerProps {
  children: ReactNode;
  /** Pixels of travel across the element's pass through the viewport. Negative = moves up faster. */
  speed?: number;
  container?: RefObject<HTMLElement | null>;
  className?: string;
}

export function ParallaxLayer({ children, speed = 120, container, className }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed / 2, -speed / 2]);
  return (
    <motion.div ref={ref} style={{ y: reduced ? 0 : y }} className={cn("will-change-transform", className)}>
      {children}
    </motion.div>
  );
}
