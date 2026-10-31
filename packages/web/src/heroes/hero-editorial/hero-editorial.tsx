"use client";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

/** Editorial portfolio hero: oversized name rising letter by letter, a clip-path image reveal and a slow marquee of disciplines. */
export function HeroEditorial({ name = "Studio Ōku", image, disciplines = ["Brand", "Motion", "Interface", "Type", "Spatial"], className }: { name?: string; image: string; disciplines?: string[]; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <section className={cn("relative flex flex-col justify-between overflow-hidden bg-[#efece6] p-6 text-[#151412] dark:bg-[#151412] dark:text-[#efece6]", className)}>
      <div className="flex justify-between text-xs tracking-wide uppercase"><span>Independent design studio</span><span>Est. 2016 — Lisbon</span></div>
      <div className="relative">
        <motion.div initial={reduced ? false : { clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0% 0 0 0)" }} transition={{ duration: 1.2, delay: 0.5, ease: [0.77, 0, 0.18, 1] }} className="absolute top-1/2 right-[8%] w-[28%] -translate-y-1/2 overflow-hidden rounded-sm">
          <motion.img src={image} alt="" initial={reduced ? false : { scale: 1.4 }} animate={{ scale: 1 }} transition={{ duration: 1.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }} className="aspect-[3/4] w-full object-cover" />
        </motion.div>
        <h1 className="relative flex overflow-hidden text-[18cqw] leading-[0.85] font-black tracking-[-0.06em] mix-blend-difference [container-type:inline-size] sm:text-[15vw]" aria-label={name}>
          {Array.from(name).map((ch, i) => (
            <motion.span key={i} aria-hidden className="inline-block whitespace-pre" initial={reduced ? false : { y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.05 * i, duration: 1, ease: [0.16, 1, 0.3, 1] }}>{ch}</motion.span>
          ))}
        </h1>
      </div>
      <div className="overflow-hidden border-t border-current/20 pt-3">
        <motion.div className="flex w-max gap-8 text-2xl font-medium" animate={reduced ? {} : { x: ["0%", "-50%"] }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}>
          {[...disciplines, ...disciplines].map((d, i) => <span key={i} className="flex items-center gap-8">{d}<span className="text-sm">✳</span></span>)}
        </motion.div>
      </div>
    </section>
  );
}
