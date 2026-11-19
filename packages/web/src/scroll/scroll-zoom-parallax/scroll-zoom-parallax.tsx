"use client";
import { useRef, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface ScrollZoomParallaxProps {
  /** Exactly 7 images: the first is the centre hero that ends up full-screen. */
  images: string[];
  container?: RefObject<HTMLElement | null>;
  className?: string;
}

// position & size (in % of the viewport) of each tile in the collage; index 0 = centre
const TILES = [
  { top: 37.5, left: 37.5, w: 25, h: 25, s: 4 },
  { top: 12, left: 41, w: 35, h: 23, s: 5 },
  { top: 28, left: 12, w: 22, h: 40, s: 6 },
  { top: 39, left: 66, w: 21, h: 25, s: 5 },
  { top: 66, left: 40, w: 22, h: 22, s: 6 },
  { top: 66, left: 15, w: 23, h: 20, s: 8 },
  { top: 67, left: 65, w: 15, h: 18, s: 9 },
];

function Tile({ src, i, p }: { src: string; i: number; p: MotionValue<number> }) {
  const t = TILES[i];
  const scale = useTransform(p, [0, 1], [1, t.s]);
  return (
    <motion.div className="absolute inset-0 flex items-center justify-center" style={{ scale }}>
      <div className="absolute overflow-hidden rounded-xl" style={{ top: `${t.top}%`, left: `${t.left}%`, width: `${t.w}%`, height: `${t.h}%` }}>
        <img src={src} alt="" className="size-full object-cover" />
      </div>
    </motion.div>
  );
}

/**
 * "Zoom parallax": a collage of seven photos pinned in place; as you scroll, every tile scales up
 * around the viewport centre at a different rate, so the outer images fly past the edges while the
 * centre photo grows to fill the screen. Seven transforms, no layout work.
 */
export function ScrollZoomParallax({ images, container, className }: ScrollZoomParallaxProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start start", "end end"] });

  if (reduced)
    return (
      <div ref={ref} className={cn("grid grid-cols-2 gap-3 p-4 sm:grid-cols-3", className)}>
        {images.slice(0, 7).map((s, i) => <img key={i} src={s} alt="" className={cn("w-full rounded-xl object-cover", i === 0 ? "col-span-full aspect-video" : "aspect-square")} />)}
      </div>
    );

  return (
    <div ref={ref} className={cn("relative h-[300cqh]", className)}>
      <div className="sticky top-0 h-[100cqh] overflow-hidden">
        {images.slice(0, 7).map((src, i) => <Tile key={i} src={src} i={i} p={scrollYProgress} />)}
      </div>
    </div>
  );
}
