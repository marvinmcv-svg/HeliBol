"use client";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { cn, usePrefersTouch, useReducedMotion } from "@kinetik/core";

export interface HeroDepthLandscapeProps {
  children?: ReactNode;
  /** Sky gradient top → horizon. */
  sky?: [string, string];
  /** Ridge colours, far → near. */
  ridges?: string[];
  className?: string;
}

const DEFAULT_RIDGES = ["#7c5cbf", "#5b3f9e", "#40287a", "#2a1757", "#170b33"];

function ridgePath(seed: number, base: number, amp: number) {
  // deterministic jagged ridge across a 1600-wide canvas (wider than the view for parallax room)
  let d = `M-200 ${base}`;
  for (let x = -200; x <= 1800; x += 80) {
    const y = base - Math.abs(Math.sin(x * 0.004 * (seed + 1) + seed * 1.7)) * amp - Math.sin(x * 0.013 + seed) * amp * 0.25;
    d += ` L${x} ${y.toFixed(1)}`;
  }
  return `${d} L1800 600 L-200 600 Z`;
}

function Layer({ i, n, d, color, mx, my, scroll, reduced }: { i: number; n: number; d: string; color: string; mx: MotionValue<number>; my: MotionValue<number>; scroll: MotionValue<number>; reduced: boolean }) {
  const depth = (i + 1) / n; // 0 far … 1 near
  const x = useTransform(mx, (v) => (reduced ? 0 : v * 40 * depth));
  const yPointer = useTransform(my, (v) => (reduced ? 0 : v * 14 * depth));
  const yScroll = useTransform(scroll, [0, 1], [0, reduced ? 0 : 220 * depth]);
  const y = useTransform([yPointer, yScroll] as MotionValue<number>[], ([a, b]: number[]) => a + b);
  return (
    <motion.svg aria-hidden viewBox="0 0 1600 600" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-[-6%] bottom-0 h-full w-[112%]" style={{ x, y }}>
      <path d={d} fill={color} />
    </motion.svg>
  );
}

/**
 * Editorial landscape hero: five ridge layers, a glowing sun and drifting fog move at different
 * depths with the pointer (spring) and with scroll (near ridges fall away fastest), while the
 * headline sits between the mountains — in front of the far ridges, behind the near ones.
 */
export function HeroDepthLandscape({ children, sky = ["#1b0f3b", "#f59e7b"], ridges = DEFAULT_RIDGES, className }: HeroDepthLandscapeProps) {
  const reduced = useReducedMotion();
  const touch = usePrefersTouch();
  const ref = useRef<HTMLElement>(null);
  const mxRaw = useMotionValue(0), myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, { stiffness: 60, damping: 20 }), my = useSpring(myRaw, { stiffness: 60, damping: 20 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 120]);
  const sunY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 60]);
  const sunX = useTransform(mx, (v) => (reduced ? 0 : v * 8));
  const paths = ridges.map((_, i) => ridgePath(i + 2, 330 + i * 55, 150 - i * 18));
  const split = Math.ceil(ridges.length / 2);

  return (
    <section
      ref={ref}
      onPointerMove={(e) => {
        if (touch || reduced) return;
        const r = e.currentTarget.getBoundingClientRect();
        mxRaw.set(((e.clientX - r.left) / r.width - 0.5) * -2);
        myRaw.set(((e.clientY - r.top) / r.height - 0.5) * -2);
      }}
      className={cn("relative isolate h-full min-h-[480px] overflow-hidden", className)}
      style={{ background: `linear-gradient(to bottom, ${sky[0]}, ${sky[1]})` }}
    >
      <motion.div aria-hidden className="absolute left-1/2 top-[38%] size-40 -translate-x-1/2 rounded-full bg-[#ffd9b0] shadow-[0_0_120px_60px_rgb(255_190_140/.55)]" style={{ y: sunY, x: sunX }} />
      {ridges.slice(0, split).map((c, i) => <Layer key={i} i={i} n={ridges.length} d={paths[i]} color={c} mx={mx} my={my} scroll={scrollYProgress} reduced={reduced} />)}
      <motion.div className="absolute inset-x-0 top-[16%] z-10 px-6 text-center text-white" style={{ y: textY }}>
        {children}
      </motion.div>
      {ridges.slice(split).map((c, i) => <Layer key={i + split} i={i + split} n={ridges.length} d={paths[i + split]} color={c} mx={mx} my={my} scroll={scrollYProgress} reduced={reduced} />)}
      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-[-20%] bottom-[18%] h-32 bg-[radial-gradient(ellipse_at_center,rgb(255_255_255/.18),transparent_70%)] blur-2xl"
          animate={{ x: ["-6%", "6%", "-6%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </section>
  );
}
