"use client";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";
import { easeBezier } from "@kinetik/tokens";

const fallback = ["linear-gradient(135deg,#c08457,#7c3f22)", "linear-gradient(180deg,#9ec5e8,#e8d6b0 60%,#c9a36b)", "linear-gradient(135deg,#7fb069,#2d5a27)", "linear-gradient(135deg,#a1a1aa,#3f3f46)"];
const bg = (images: string[], i: number) => ({ backgroundImage: images[i] ? `url(${images[i]})` : fallback[i % fallback.length], backgroundSize: "cover", backgroundPosition: "center" });
const nav = ["Platform", "Solutions", "Resources"];

/** About-page hero: full nav with three CTAs, a bold centered headline and paragraph, and a photo collage whose side photos are carved by huge sweeping curves. */
export function HeroCurvedCollage({ title = "The amazing story", subtitle = "We're a passionate bunch working from all over the world to build the future of product research together.", images = [], className }: { title?: string; subtitle?: string; images?: string[]; className?: string }) {
  const reduced = useReducedMotion();
  const tile = (d: number, x: number, y = 0) => (reduced ? {} : { initial: { opacity: 0, x, y, scale: 0.96 }, animate: { opacity: 1, x: 0, y: 0, scale: 1 }, transition: { delay: d, duration: 1.1, ease: easeBezier.expoOut } });
  return (
    <section className={cn("relative flex flex-col overflow-hidden bg-white text-[#111]", className)}>
      <nav className="relative z-20 flex items-center justify-between px-[5.5%] py-7 text-[15px]">
        <span className="flex items-center gap-2 text-2xl font-bold tracking-tight"><svg aria-hidden width="34" height="18" viewBox="0 0 34 18" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round"><path d="M2 15 C 6 2, 11 2, 13 9 S 21 16, 24 8 S 30 2, 32 15" /></svg>mosaic</span>
        <span className="hidden gap-9 lg:flex">{nav.map((n) => <a key={n} href="#">{n} <span className="text-xs">⌄</span></a>)}<a href="#">Enterprise</a><a href="#">Pricing</a></span>
        <span className="flex items-center gap-5 text-sm"><a href="#">Log in</a><a href="#" className="rounded-full bg-[#2d5cff] px-5 py-2.5 font-medium text-white">Get started free</a><a href="#" className="hidden rounded-full bg-[#d7e2ff] px-5 py-2.5 font-medium text-[#2d5cff] sm:inline">Request a demo</a></span>
      </nav>
      <div className="relative z-10 mx-auto max-w-[40rem] px-6 pt-[6.5%] pb-[4%] text-center">
        <motion.h1 {...tile(0, 0, 16)} className="text-[clamp(2.4rem,4.4vw,4.1rem)] font-bold tracking-[-.025em]">{title}</motion.h1>
        <motion.p {...tile(0.1, 0, 16)} className="mt-6 text-[clamp(1.05rem,2.2vw,2rem)] leading-[1.2]">{subtitle}</motion.p>
      </div>
      <div aria-hidden className="relative min-h-60 flex-1">
        <motion.div {...tile(0.15, 0, 30)} className="absolute inset-y-0 left-[20.8%] w-[58.4%]" style={bg(images, 0)} />
        <motion.div {...tile(0.3, -60)} className="absolute top-0 bottom-0 left-0 w-[19.4%] rounded-tr-[120px]" style={bg(images, 1)} />
      </div>
      <motion.div aria-hidden {...tile(0.35, 60)} className="absolute top-[7%] right-0 h-[32%] w-[9.5%] rounded-bl-[120px]" style={bg(images, 2)} />
      <motion.div aria-hidden {...tile(0.45, 60)} className="absolute right-0 bottom-0 h-[59%] w-[19.4%] rounded-tl-[170px]" style={bg(images, 3)} />
    </section>
  );
}
