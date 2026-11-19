"use client";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";
import { easeBezier } from "@kinetik/tokens";

const css = `
@property --oa{syntax:"<angle>";initial-value:0deg;inherits:false}
.k-hoc .orb{background:radial-gradient(circle at 42% 52%,#ff5d6c 0,#ff8a86 22%,#ffb39a 45%,#f8cfc0 64%,#f2c9c0 69.5%,transparent 70%);animation:k-hoc-breathe 9s ease-in-out infinite alternate}
@keyframes k-hoc-breathe{to{transform:translate(-3%,2%) scale(1.06);filter:hue-rotate(-15deg)}}
.k-hoc .plus{transition:transform .5s cubic-bezier(.34,1.56,.64,1)}
.k-hoc .card:hover .plus{transform:rotate(135deg)}
.k-hoc .grid3d{background:linear-gradient(#7c3aed66 1px,transparent 1px) 0 0/22px 22px,linear-gradient(90deg,#7c3aed66 1px,transparent 1px) 0 0/22px 22px;transform:perspective(300px) rotateX(55deg);transform-origin:bottom;animation:k-hoc-grid 3s linear infinite}
@keyframes k-hoc-grid{to{background-position:0 22px,0 0}}
@media (prefers-reduced-motion:reduce){.k-hoc *{animation:none!important}}
[data-reduce-motion] .k-hoc *{animation:none!important}`;

/** Agency hero: wordmark and small nav, a soft coral orb glowing behind huge frosted pill CTAs, and a row of client case cards — each with a tiny site preview — fanning in. */
export function HeroOrbClients({ intro = "We create scalable digital experiences that help you to make an impact. Our award-winning team of experts work with you to build websites that speak to your target audience and help you to stand out. Let us build solutions that captivate and inspire your audience.", className }: { intro?: string; className?: string }) {
  const reduced = useReducedMotion();
  const enter = (i: number) => (reduced ? {} : { initial: { opacity: 0, x: 90, rotate: 5 }, animate: { opacity: 1, x: 0, rotate: 0 }, transition: { delay: 0.15 + i * 0.12, duration: 0.9, ease: easeBezier.expoOut } });
  const pill = "group rounded-full bg-white/45 px-[2.4vw] py-[1.6vw] text-[clamp(1rem,2vw,1.85rem)] uppercase backdrop-blur-md transition-colors hover:bg-white/70";
  return (
    <section className={cn("k-hoc relative flex flex-col overflow-hidden bg-[#e4e2df] px-[1%] pt-3 text-[#1c1c1c]", className)}>
      <style href="k-hoc" precedence="kinetik">{css}</style>
      <div aria-hidden className="orb absolute top-[-38%] left-[30%] aspect-square w-[78%] rounded-full" />
      <header className="relative flex items-center justify-between">
        <span className="text-[clamp(1.4rem,2vw,2rem)] tracking-tight">OFF/GRID.</span>
        <span className="flex items-center gap-5 text-[12px] uppercase"><a href="#">Manifesto ↗</a><a href="#">Studio Enterprise ↗</a><a href="#" className="rounded-full bg-white/60 px-5 py-2.5 backdrop-blur">Contact →</a></span>
      </header>
      <div className="relative mt-[4%] grid flex-1 grid-cols-[30%_1fr] gap-[3%] pl-[8%]">
        <div className="flex flex-col"><h1 className="text-[13px] leading-[1.35]">{intro}</h1><p className="mt-[25%] text-[12px] tracking-wide uppercase">Our clients</p></div>
        <div className="flex flex-col">
          <div className="flex gap-3 pl-[7%]"><a href="#" className={pill}>Go big <span className="inline-block transition-transform group-hover:translate-x-1">→</span></a><a href="#" className={pill}>Capabilities deck <span className="inline-block transition-transform group-hover:-translate-y-1">↗</span></a></div>
          <ul className="-ml-[7%] mt-[7%] flex items-start gap-[2%]">
            <motion.li {...enter(0)} className="card relative aspect-[9/10] w-[37%] shrink-0 overflow-hidden rounded-2xl border border-black/40 bg-gradient-to-b from-[#fbe3d1] via-[#f6c6a0] to-[#c9a2f0] p-4">
              <div aria-hidden className="grid3d absolute inset-x-[-20%] bottom-0 h-1/2" />
              <div aria-hidden className="absolute bottom-0 left-[36%] h-[42%] w-[28%] [transform:perspective(300px)_rotateX(55deg)] origin-bottom bg-[repeating-linear-gradient(0deg,#5b21b6_0_14px,#a78bfa_14px_16px)] shadow-[0_0_40px_#8b5cf6]" />{[18, 34, 62, 76].map((l, i) => <span key={l} aria-hidden className="absolute size-4 rotate-12 rounded-sm bg-[#e8b7a8]/70" style={{ left: `${l}%`, top: `${30 + (i % 2) * 18}%` }} />)}
              <div className="relative flex justify-between text-[12px] uppercase"><span>Jasmine.ai</span><span className="plus text-3xl leading-none font-extralight">+</span></div>
              <a href="#" className="absolute bottom-5 left-4 rounded-full border border-black/30 bg-white/70 px-4 py-2 text-[12px] uppercase">View website →</a>
            </motion.li>
            <motion.li {...enter(1)} className="card relative aspect-[9/10] w-[37%] shrink-0 overflow-hidden rounded-2xl bg-gradient-to-b from-[#f4fbfd] to-[#d5eef5] p-4">
              <div className="flex justify-between text-[12px] uppercase"><span>Tilman Fiber</span><span className="plus text-3xl leading-none font-extralight">+</span></div>
              <div aria-hidden className="absolute top-[22%] left-0 w-[62%] rounded-r-md bg-white text-[9px] shadow-lg"><p className="px-2 py-1 text-[6px]">Home About Press FAQs Contact</p><p className="px-2 text-[clamp(.9rem,1.6vw,1.5rem)] leading-none font-semibold tracking-tight">generation<br />networks</p><div className="mt-2 h-12 bg-gradient-to-br from-[#1d4ed8] via-[#020617] to-[#2563eb]" /></div>
              <div aria-hidden className="absolute top-[37%] right-[10%] w-[32%] rounded-md bg-white p-1.5 text-[7px] shadow-lg"><div className="h-12 rounded bg-gradient-to-br from-[#0ea5e9] via-[#1e1b4b] to-[#7c3aed]" /><p className="mt-1">Anything but ordinary</p><p className="text-zinc-400">Established 2021.</p></div>
              <a href="#" className="absolute bottom-5 left-4 rounded-full border border-black/30 bg-white/70 px-4 py-2 text-[12px] uppercase">View case study →</a>
            </motion.li>
            <motion.li {...enter(2)} className="card relative aspect-[9/10] w-[37%] shrink-0 overflow-hidden rounded-2xl bg-[#111] p-4 text-white"><div className="flex justify-between text-[12px] uppercase"><span>Nightjar</span><span className="plus text-3xl leading-none font-extralight">+</span></div></motion.li>
          </ul>
        </div>
      </div>
      <span aria-hidden className="absolute right-[2%] bottom-[2%] grid size-8 place-items-center rounded-md bg-white/70 text-sm">≡</span>
    </section>
  );
}
