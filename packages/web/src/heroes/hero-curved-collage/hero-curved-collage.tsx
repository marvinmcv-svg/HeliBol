"use client";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";
import { easeBezier } from "@kinetik/tokens";

const fallback = ["linear-gradient(135deg,#fda4af,#fb7185)", "linear-gradient(135deg,#93c5fd,#2563eb)", "linear-gradient(135deg,#fde68a,#f59e0b)", "linear-gradient(135deg,#a7f3d0,#059669)", "linear-gradient(135deg,#c4b5fd,#7c3aed)"];
const bg = (images: string[], i: number) => ({ backgroundImage: images[i] ? `url(${images[i]})` : fallback[i % fallback.length], backgroundSize: "cover", backgroundPosition: "center" });

/** About/story hero: centered statement with a photo collage whose side tiles are cut by big sweeping curves and drift in on load. */
export function HeroCurvedCollage({ title = "The amazing story", subtitle = "A passionate bunch working from all over the world to build the future of product research — together.", images = [], className }: { title?: string; subtitle?: string; images?: string[]; className?: string }) {
  const reduced = useReducedMotion();
  const tile = (d: number, x: number) => (reduced ? {} : { initial: { opacity: 0, x, scale: 0.94 }, animate: { opacity: 1, x: 0, scale: 1 }, transition: { delay: d, duration: 1.1, ease: easeBezier.expoOut } });
  return (
    <section className={cn("relative overflow-hidden bg-white text-zinc-900", className)}>
      <div className="relative z-10 mx-auto max-w-xl px-6 pt-14 text-center">
        <motion.h1 {...tile(0, 0)} className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</motion.h1>
        <motion.p {...tile(0.1, 0)} className="mt-4 text-zinc-600">{subtitle}</motion.p>
      </div>
      <div aria-hidden className="relative mx-auto mt-10 grid h-64 max-w-5xl grid-cols-[1fr_2.6fr_1fr] gap-3 px-0">
        <motion.div {...tile(0.25, -60)} className="mt-14 rounded-tr-[120px] rounded-br-2xl" style={bg(images, 0)} />
        <motion.div {...tile(0.15, 0)} className="rounded-t-2xl" style={bg(images, 1)} />
        <div className="grid grid-rows-[1fr_1.3fr] gap-3">
          <motion.div {...tile(0.3, 60)} className="rounded-bl-[90px]" style={bg(images, 2)} />
          <motion.div {...tile(0.4, 60)} className="rounded-tl-[90px]" style={bg(images, 3)} />
        </div>
      </div>
    </section>
  );
}
