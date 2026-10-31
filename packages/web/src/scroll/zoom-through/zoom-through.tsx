"use client";
import { useRef, type RefObject } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

/** Scroll zooms *through* a giant word: the text scales up until its counter fills the screen and reveals the image behind. */
export function ZoomThrough({ word, image, container, className }: { word: string; image: string; container?: RefObject<HTMLElement | null>; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start start", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 40]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.4, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.7, 0.85], [1, 0]);
  return (
    <div ref={ref} className={cn("relative h-[260cqh]", className)}>
      <div className="sticky top-0 h-[100cqh] overflow-hidden">
        <motion.img src={image} alt="" style={reduced ? undefined : { scale: imgScale }} className="absolute inset-0 h-full w-full object-cover" />
        {!reduced && (
          <motion.div style={{ scale, opacity: textOpacity }} className="absolute inset-0 grid origin-[50%_48%] place-items-center bg-background mix-blend-screen dark:mix-blend-multiply">
            <span className="text-[22cqw] leading-none font-black tracking-tighter text-black dark:text-white">{word}</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
