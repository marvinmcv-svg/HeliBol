"use client";
import { useRef, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface FanCard { src: string; title: string; alt?: string }
export interface ScrollCardsFanProps {
  cards: FanCard[];
  heading?: string;
  container?: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * Pinned section where a tight stack of cards deals itself into a wide arc as you scroll: each card
 * rotates around a pivot far below the stage, spreading like a hand of playing cards, while the
 * heading rises above. Scroll back and they gather again. Reduced motion shows the finished fan.
 */
export function ScrollCardsFan({ cards, heading = "A hand worth holding", container, className }: ScrollCardsFanProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start start", "end end"] });
  const p = useTransform(scrollYProgress, [0.05, 0.75], [0, 1], { clamp: true });
  const headY = useTransform(p, [0, 1], [40, 0]);
  const headO = useTransform(p, [0, 0.5], [0.2, 1]);
  const n = cards.length;
  return (
    <div ref={ref} className={cn("relative", reduced ? "h-[100cqh]" : "h-[260cqh]", className)}>
      <div className="sticky top-0 grid h-[100cqh] place-items-center overflow-hidden">
        <motion.h3 style={reduced ? undefined : { y: headY, opacity: headO }} className="absolute top-[12%] px-6 text-center text-4xl font-semibold tracking-tight">{heading}</motion.h3>
        <div className="relative mt-[12cqh] h-[46cqh] w-[30cqh]">
          {cards.map((c, i) => (
            <Card key={c.src + i} c={c} i={i} n={n} p={p} reduced={reduced} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ c, i, n, p, reduced }: { c: FanCard; i: number; n: number; p: MotionValue<number>; reduced: boolean }) {
  const mid = (n - 1) / 2;
  const spread = 13; // degrees between cards when fully fanned
  const target = (i - mid) * spread;
  const rotate = useTransform(p, (v) => (reduced ? target : target * v + (i - mid) * 1.5 * (1 - v)));
  const y = useTransform(p, (v) => (reduced ? Math.abs(i - mid) * 8 : Math.abs(i - mid) * 8 * v - (1 - v) * i * 2));
  return (
    <motion.figure
      className="absolute inset-0 overflow-hidden rounded-2xl border border-white/20 bg-card shadow-[0_20px_40px_-15px_rgb(0_0_0/.5)]"
      style={{ rotate, y, transformOrigin: "50% 260%", zIndex: i }}
    >
      <img src={c.src} alt={c.alt ?? ""} className="h-full w-full object-cover" />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 text-sm font-medium text-white">{c.title}</figcaption>
    </motion.figure>
  );
}
