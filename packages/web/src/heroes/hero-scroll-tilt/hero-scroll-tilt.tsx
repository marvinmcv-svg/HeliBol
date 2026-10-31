"use client";
import { useRef, type ReactNode, type RefObject } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

/** Product screenshot starts tilted back in 3D under the headline and rotates flat, scaling up, as you scroll. */
export function HeroScrollTilt({ title, children, container, className }: { title: ReactNode; children: ReactNode; container?: RefObject<HTMLElement | null>; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start start", "end end"] });
  const rotateX = useTransform(scrollYProgress, [0, 0.6], [24, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [0.9, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.6], [0, -80]);
  return (
    <div ref={ref} className={cn("relative h-[180cqh] px-4", className)}>
      <div className="sticky top-0 flex h-[100cqh] flex-col items-center justify-center [perspective:1000px]">
        <motion.div style={reduced ? undefined : { y: titleY }} className="mb-8 text-center">{title}</motion.div>
        <motion.div style={reduced ? undefined : { rotateX, scale }} className="w-full max-w-4xl origin-top rounded-3xl border-4 border-zinc-700 bg-zinc-900 p-2 shadow-[0_40px_120px_-30px_rgb(0_0_0/.6)]">
          <div className="overflow-hidden rounded-2xl">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
