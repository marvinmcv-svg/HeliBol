"use client";
import { useId, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface TextCircularProps {
  text: string;
  /** seconds per revolution */
  duration?: number;
  size?: number;
  reverse?: boolean;
  /** speed up on hover */
  hoverBoost?: boolean;
  children?: ReactNode;
  className?: string;
}

/** Text set on a circle (SVG textPath) that slowly spins around a center badge. */
export function TextCircular({ text, duration = 14, size = 160, reverse = false, hoverBoost = true, children, className }: TextCircularProps) {
  const id = `k-circ-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const reduced = useReducedMotion();
  return (
    <div className={cn("group relative grid place-items-center", className)} style={{ width: size, height: size }} aria-label={text}>
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden
        animate={reduced ? undefined : { rotate: reverse ? -360 : 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        style={{ animationPlayState: "running" }}
      >
        <defs>
          <path id={id} d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-current text-[9.5px] font-semibold tracking-[0.32em] uppercase">
          <textPath href={`#${id}`} textLength={238}>{text}</textPath>
        </text>
      </motion.svg>
      <div className={cn("relative transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)]", hoverBoost && "group-hover:scale-110 group-hover:rotate-[-12deg]")}>{children}</div>
    </div>
  );
}
