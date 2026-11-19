"use client";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";
import { easeBezier } from "@kinetik/tokens";

const apps = ["#30d158", "#ffffff", "#ff9f0a", "#1c1c1e", "#0a84ff", "#ffd60a", "#ffffff", "#30d158", "#1c1c1e", "#ff375f", "#0a84ff", "#ff453a", "#ff375f", "#ff9f0a", "#8e8e93", "#64d2ff"];

/** Foldable-device launch hero on soft grey: centered title, two lines of copy, pre-order note and pill CTAs, then the device unfolds on its hinge in 3D between two hands, revealing a photo memory and a widget/app grid. */
export function HeroFoldOpen({ title = "Phone Duo", subtitle = "The largest phone display ever. Foldable, posable, standable. Featuring unique experiences for ultimate versatility.", className }: { title?: string; subtitle?: string; className?: string }) {
  const reduced = useReducedMotion();
  const enter = (d: number) => (reduced ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.7, ease: easeBezier.expoOut } });
  return (
    <section className={cn("flex flex-col overflow-hidden bg-[#f5f5f7] pt-[3%] text-center text-[#1d1d1f]", className)}>
      <motion.h1 {...enter(0)} className="text-[clamp(2.4rem,4.2vw,4rem)] font-semibold tracking-[-.02em]">{title}</motion.h1>
      <motion.p {...enter(0.08)} className="mx-auto mt-2 max-w-[44rem] text-[clamp(.9rem,1.45vw,1.35rem)] leading-tight font-medium text-[#424245]">{subtitle}</motion.p>
      <motion.p {...enter(0.12)} className="mt-3 text-[clamp(.6rem,.85vw,.8rem)] text-[#6e6e73]">Pre-order starting at 5:00 a.m. PT on 10.16<br />Available starting 10.23</motion.p>
      <motion.div {...enter(0.16)} className="mt-3 flex justify-center gap-3 text-[13px]">
        <a href="#" className="rounded-full bg-[#1d1d1f] px-4 py-2 text-white">Learn more</a>
        <a href="#" className="rounded-full border border-[#1d1d1f] px-4 py-2">View pricing</a>
      </motion.div>
      <div aria-hidden className="relative mx-auto mt-[3%] aspect-[1.27] w-[42%] min-w-72 flex-none">
        {[false, true].map((r) => (
          <svg key={String(r)} viewBox="0 0 200 320" className={cn("absolute bottom-[-14%] z-0 h-[82%]", r ? "right-[-15%] -scale-x-100" : "left-[-15%]")}>
            <defs><linearGradient id={`k-hfo-skin${r}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f0cdb5" /><stop offset="1" stopColor="#c08a6c" /></linearGradient></defs>
            <path d="M30 320 C 20 250, 40 190, 80 150 C 100 130, 120 120, 140 118 C 150 118, 154 130, 146 140 L 120 170 C 150 160, 175 158, 182 170 C 188 182, 176 190, 160 196 L 120 210 C 110 250, 100 290, 104 320Z" fill={`url(#k-hfo-skin${r})`} />
          </svg>
        ))}
        <div className="absolute inset-x-[3%] top-0 bottom-[8%] z-10 flex [perspective:1400px]">
          <motion.div initial={reduced ? false : { rotateY: 115 }} animate={{ rotateY: 12 }} transition={{ delay: 0.5, duration: 1.6, ease: easeBezier.expoOut }} style={{ transformOrigin: "right center", transformStyle: "preserve-3d" }} className="h-full flex-1 rounded-l-[28px] border-[6px] border-r-0 border-[#2b2b2d] bg-[#d9d2c7] p-[5%]">
            <div className="flex h-full flex-col justify-end rounded-2xl bg-[radial-gradient(circle_at_50%_30%,#f2b8a6,#9b7a66_60%,#5b4a3f)] p-2 text-left text-[10px] font-semibold text-white">On This Day<span className="font-normal opacity-80">April 1, 2025</span></div>
          </motion.div>
          <motion.div initial={reduced ? false : { rotateY: 0 }} animate={{ rotateY: -12 }} transition={{ delay: 0.5, duration: 1.6, ease: easeBezier.expoOut }} style={{ transformOrigin: "left center" }} className="grid h-full flex-1 grid-cols-4 content-start gap-[6%] rounded-r-[28px] border-[6px] border-l-[3px] border-[#2b2b2d] border-l-[#555] bg-gradient-to-b from-[#c9d6e6] via-[#d8d3cc] to-[#c4b8aa] p-[6%]">
            <div className="col-span-2 aspect-square rounded-xl bg-[#4a78c2]/80 p-1 text-left text-[8px] text-white">San Francisco<br /><b className="text-base">54°</b></div><div className="col-span-2 aspect-square rounded-xl bg-white/70" />
            {apps.map((c, i) => <span key={i} className="aspect-square rounded-[22%]" style={{ background: c }} />)}
          </motion.div>
        </div>
        {[false, true].map((r) => <span key={String(r)} className={cn("absolute bottom-[20%] z-20 h-[9%] w-[13%] rounded-full bg-gradient-to-r from-[#e8c0a6] to-[#d6a387]", r ? "right-[-4%] rotate-[28deg]" : "left-[-4%] -rotate-[28deg]")} />)}
      </div>
    </section>
  );
}
