"use client";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";
import { easeBezier } from "@kinetik/tokens";

const apps = ["#34c759", "#0a84ff", "#ff9f0a", "#ff375f", "#5e5ce6", "#64d2ff", "#ffd60a", "#bf5af2", "#30d158", "#ff453a", "#8e8e93", "#0a84ff"];

/** Foldable-device hero: centered launch copy, then the device unfolds on its hinge in 3D, revealing a photo panel and an app grid. */
export function HeroFoldOpen({ title = "Phone Fold", subtitle = "The largest display ever on a phone. Foldable, posable, standable.", className }: { title?: string; subtitle?: string; className?: string }) {
  const reduced = useReducedMotion();
  const enter = (d: number) => (reduced ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.7, ease: easeBezier.expoOut } });
  return (
    <section className={cn("overflow-hidden bg-[#f5f5f7] pt-10 text-center text-[#1d1d1f]", className)}>
      <motion.h1 {...enter(0)} className="text-5xl font-semibold tracking-tight">{title}</motion.h1>
      <motion.p {...enter(0.08)} className="mx-auto mt-3 max-w-md text-[15px] text-zinc-600">{subtitle}</motion.p>
      <motion.div {...enter(0.16)} className="mt-5 flex justify-center gap-3 text-sm">
        <a href="#" className="rounded-full bg-[#1d1d1f] px-4 py-2 text-white">Learn more</a>
        <a href="#" className="rounded-full border border-[#1d1d1f] px-4 py-2">View pricing</a>
      </motion.div>
      <div aria-hidden className="mx-auto mt-10 flex w-fit [perspective:1200px]">
        <motion.div initial={reduced ? false : { rotateY: 110 }} animate={{ rotateY: 0 }} transition={{ delay: 0.5, duration: 1.6, ease: easeBezier.expoOut }} style={{ transformOrigin: "right center", transformStyle: "preserve-3d" }} className="h-56 w-40 rounded-l-[22px] border-[5px] border-r-0 border-zinc-800 bg-gradient-to-br from-[#f4c7a1] via-[#e8a0a0] to-[#6c5b7b] p-3">
          <div className="flex h-full flex-col justify-end rounded-xl bg-black/15 p-2 text-left text-[10px] font-semibold text-white">On this day<span className="font-normal opacity-80">April 1, 2026</span></div>
        </motion.div>
        <div className="grid h-56 w-40 grid-cols-4 content-start gap-2 rounded-r-[22px] border-[5px] border-l-2 border-zinc-800 border-l-zinc-600 bg-gradient-to-b from-[#d9e4f5] to-[#c5d3ea] p-3">
          <div className="col-span-2 h-12 rounded-lg bg-white/70" /><div className="col-span-2 h-12 rounded-lg bg-white/70" />
          {apps.map((c, i) => <span key={i} className="aspect-square rounded-lg" style={{ background: c }} />)}
        </div>
      </div>
    </section>
  );
}
