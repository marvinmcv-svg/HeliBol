"use client";
import { useRef, type ReactNode, type RefObject } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface ScrollMediaExpandProps {
  image: string;
  /** Two halves of the headline that part as the media grows. */
  title: [string, string];
  children?: ReactNode;
  container?: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * Keynote-style reveal: a small rounded image sits between the two halves of a headline; as you
 * scroll it grows to full-bleed, its corners square off and its zoom settles, while the headline
 * halves slide apart to the edges and fade. Then the caption rises in.
 */
export function ScrollMediaExpand({ image, title, children, container, className }: ScrollMediaExpandProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start start", "end end"] });
  const p = useTransform(scrollYProgress, [0, 0.7], [0, 1], { clamp: true });
  const w = useTransform(p, [0, 1], ["34%", "100%"]);
  const h = useTransform(p, [0, 1], ["38%", "100%"]);
  const radius = useTransform(p, [0, 0.9], [28, 0]);
  const imgScale = useTransform(p, [0, 1], [1.4, 1]);
  const left = useTransform(p, [0, 1], ["0%", "-60%"]);
  const right = useTransform(p, [0, 1], ["0%", "60%"]);
  const titleO = useTransform(p, [0.3, 0.8], [1, 0]);
  const cap = useTransform(scrollYProgress, [0.72, 0.92], [0, 1]);
  const capY = useTransform(scrollYProgress, [0.72, 0.92], [24, 0]);

  if (reduced)
    return (
      <div ref={ref} className={cn("relative h-[100cqh] overflow-hidden", className)}>
        <img src={image} alt="" className="size-full object-cover" />
        <div className="absolute inset-0 grid place-items-center bg-black/35 p-6 text-center text-white">
          <div><h3 className="text-5xl font-semibold tracking-tight">{title.join(" ")}</h3>{children}</div>
        </div>
      </div>
    );

  return (
    <div ref={ref} className={cn("relative h-[260cqh]", className)}>
      <div className="sticky top-0 grid h-[100cqh] place-items-center overflow-hidden">
        <motion.div className="relative z-10 overflow-hidden" style={{ width: w, height: h, borderRadius: radius }}>
          <motion.img src={image} alt="" className="size-full object-cover" style={{ scale: imgScale }} />
          <motion.div style={{ opacity: cap, y: capY }} className="absolute inset-0 grid place-items-end bg-gradient-to-t from-black/70 via-transparent p-8 text-white">
            <div className="w-full">{children}</div>
          </motion.div>
        </motion.div>
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center gap-[36%] whitespace-nowrap text-[9cqw] font-semibold leading-none tracking-tight mix-blend-difference text-white">
          <motion.span style={{ x: left, opacity: titleO }}>{title[0]}</motion.span>
          <motion.span style={{ x: right, opacity: titleO }}>{title[1]}</motion.span>
        </div>
      </div>
    </div>
  );
}
