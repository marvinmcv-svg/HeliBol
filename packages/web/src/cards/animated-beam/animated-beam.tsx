"use client";
import { useEffect, useId, useState, type RefObject } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@kinetik/core";

export interface AnimatedBeamProps {
  container: RefObject<HTMLElement | null>;
  from: RefObject<HTMLElement | null>;
  to: RefObject<HTMLElement | null>;
  /** Bend of the curve in px (negative bends up). */
  curvature?: number;
  duration?: number;
  delay?: number;
  reverse?: boolean;
  colorFrom?: string;
  colorTo?: string;
}

/** An SVG path between two elements with a light pulse travelling along it. Recomputes on resize. */
export function AnimatedBeam({ container, from, to, curvature = 0, duration = 3, delay = 0, reverse = false, colorFrom = "#a855f7", colorTo = "#22d3ee" }: AnimatedBeamProps) {
  const id = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const reduced = useReducedMotion();
  const [d, setD] = useState("");
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const update = () => {
      const c = container.current?.getBoundingClientRect();
      const a = from.current?.getBoundingClientRect();
      const b = to.current?.getBoundingClientRect();
      if (!c || !a || !b) return;
      const x1 = a.left - c.left + a.width / 2;
      const y1 = a.top - c.top + a.height / 2;
      const x2 = b.left - c.left + b.width / 2;
      const y2 = b.top - c.top + b.height / 2;
      setSize({ w: c.width, h: c.height });
      setD(`M ${x1},${y1} Q ${(x1 + x2) / 2},${(y1 + y2) / 2 + curvature} ${x2},${y2}`);
    };
    update();
    const ro = new ResizeObserver(update);
    if (container.current) ro.observe(container.current);
    return () => ro.disconnect();
  }, [container, from, to, curvature]);

  const x = reverse ? ["110%", "-10%"] : ["-10%", "110%"];
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} fill="none">
      <path d={d} stroke="currentColor" strokeOpacity={0.15} strokeWidth={2} strokeLinecap="round" />
      <path d={d} stroke={`url(#${id})`} strokeWidth={2} strokeLinecap="round" />
      <defs>
        <motion.linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          initial={{ x1: "0%", x2: "0%" }}
          animate={reduced ? { x1: "0%", x2: "100%" } : { x1: x, x2: x.map((v) => `${parseFloat(v) + 10}%`) }}
          transition={reduced ? { duration: 0 } : { duration, delay, repeat: Infinity, ease: [0.16, 1, 0.3, 1], repeatDelay: 0.4 }}
        >
          <stop stopColor={colorFrom} stopOpacity="0" />
          <stop stopColor={colorFrom} />
          <stop offset="32.5%" stopColor={colorTo} />
          <stop offset="100%" stopColor={colorTo} stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </svg>
  );
}
