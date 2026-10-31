"use client";
import { useRef, type RefObject } from "react";
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity, wrap } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface TextVelocityMarqueeProps {
  text: string;
  /** base speed in % per second */
  baseVelocity?: number;
  container?: RefObject<HTMLElement | null>;
  className?: string;
}

/** A huge looping line of text whose speed, direction and skew respond to scroll velocity. */
export function TextVelocityMarquee({ text, baseVelocity = 4, container, className }: TextVelocityMarqueeProps) {
  const reduced = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll({ container });
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [0, 1000], [0, 5], { clamp: false });
  const skew = useTransform(velocity, [-2000, 2000], [12, -12]);
  const x = useTransform(base, (v) => `${wrap(-25, -50, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    let move = dir.current * baseVelocity * (delta / 1000);
    if (factor.get() < 0) dir.current = -1;
    else if (factor.get() > 0) dir.current = 1;
    move += dir.current * move * factor.get();
    base.set(base.get() + move);
  });

  return (
    <div className={cn("overflow-hidden whitespace-nowrap", className)} aria-label={text}>
      <motion.div aria-hidden className="flex w-max gap-10" style={{ x, skewX: reduced ? 0 : skew }}>
        {Array.from({ length: 4 }, (_, i) => <span key={i}>{text}</span>)}
      </motion.div>
    </div>
  );
}
