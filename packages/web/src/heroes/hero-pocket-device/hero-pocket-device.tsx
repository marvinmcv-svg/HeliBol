"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

const FONT = "https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400&family=Inter:wght@400;500;600&display=swap";
const css = `
.k-hpd{font-family:Inter,ui-sans-serif,system-ui,sans-serif}
.k-hpd .tap{animation:k-hpd-tap 2.4s ease-out infinite}
@keyframes k-hpd-tap{0%{transform:scale(.4);opacity:.8}100%{transform:scale(2.4);opacity:0}}
@media (prefers-reduced-motion:reduce){.k-hpd .tap{animation:none;opacity:0}}
[data-reduce-motion] .k-hpd .tap{animation:none;opacity:0}`;

const hw: [string, string, string?][] = [["Handheld", "▯"], ["Terminal", "◩"], ["Register", "▭"], ["Stand", "▢"], ["Kiosk", "▣"], ["Reader", "◻", "for contactless and chip"], ["Reader", "▯", "for magstripe"], ["Accessories", "■"], ["Hardware kits", "▤"], ["Compare", "◫"]];

/** Hardware hero: two-tier commerce nav with a hardware icon strip, then a soft grey split card with a NEW badge, serif two-liner, pill CTAs and a handheld terminal swinging upright to ring up a sale. */
export function HeroPocketDevice({ product = "Quad Handheld", lines = ["Fits in your pocket.", "Powers your day."], amount = 48.5, className }: { product?: string; lines?: string[]; amount?: number; className?: string }) {
  const reduced = useReducedMotion();
  const [v, setV] = useState(reduced ? amount : 0);
  useEffect(() => {
    if (reduced) return setV(amount);
    let raf = 0; const t0 = performance.now();
    const step = (t: number) => { const p = Math.min(1, (t - t0 - 600) / 1400); setV(p < 0 ? 0 : amount * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [amount, reduced]);
  return (
    <section className={cn("k-hpd flex flex-col bg-white text-[#111]", className)}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hpd" precedence="kinetik">{css}</style>
      <nav className="flex items-center justify-between px-[2%] py-4 text-[13px] font-medium"><span className="flex items-center gap-5"><span aria-hidden className="grid size-5 place-items-center rounded-[4px] border-[2.5px] border-black"><i className="size-1.5 bg-black" /></span><a href="#">Business types</a><a href="#">Products</a><a href="#">Hardware</a><a href="#">Pricing</a><a href="#">What's new</a></span><span className="flex items-center gap-5"><a href="#">Sign in</a><a href="#">Support</a><span aria-hidden>⌕</span><span aria-hidden>⛉</span></span></nav>
      <ul className="flex justify-center gap-[3.2%] border-b border-zinc-200 pb-3 text-center text-[10px]">{hw.map(([n, ic, sub], i) => <li key={i} className="flex w-16 flex-col items-center"><span aria-hidden className="grid h-10 place-items-center text-3xl text-zinc-700">{ic}</span><span>{n}</span>{sub && <span className="text-zinc-500">{sub}</span>}</li>)}</ul>
      <div className="mx-[6.6%] mt-[2.6%] mb-[3%] grid flex-1 overflow-hidden rounded-xl bg-[#f1f1f1] md:grid-cols-[1.06fr_1fr]">
        <div className="flex flex-col justify-center gap-[6%] pl-[8.5%]">
          <p className="flex items-center gap-2.5 text-[clamp(.9rem,1.35vw,1.3rem)] font-medium"><span className="bg-black px-1.5 py-0.5 text-[9px] font-semibold text-white">NEW</span>{product}</p>
          <h1 className="text-[clamp(2rem,4.1vw,3.9rem)] leading-[1.03] tracking-[-.01em]" style={{ fontFamily: "Newsreader,serif" }}>{lines.map((l) => <span key={l} className="block">{l}</span>)}</h1>
          <div className="flex gap-1.5 text-[13px] font-medium"><a href="#" className="rounded-full border border-zinc-900 px-7 py-3.5 hover:bg-white">Learn more</a><a href="#" className="rounded-full bg-black px-7 py-3.5 text-white hover:bg-zinc-800">Buy now</a></div>
        </div>
        <div aria-hidden className="relative grid min-h-80 place-items-center bg-[#f4f4f3] [perspective:900px]">
          <motion.div initial={reduced ? false : { rotateX: 50, rotateZ: -18, y: 60, opacity: 0 }} animate={{ rotateX: 0, rotateZ: -10, y: 0, opacity: 1 }} transition={{ ...spring.smooth, delay: 0.2 }} className="relative h-[68%] min-h-60 w-[22%] min-w-28 rounded-[24px] bg-gradient-to-b from-[#fafafa] to-[#d9d9d9] p-2 shadow-[0_40px_60px_-24px_#0005]">
            <div className="flex h-[72%] flex-col items-center justify-center rounded-[16px] bg-white">
              <p className="text-[10px] text-zinc-500">Total</p>
              <p className="text-2xl font-semibold tabular-nums">${v.toFixed(2)}</p>
              <p className="mt-2 rounded-full bg-zinc-900 px-3 py-1 text-[9px] text-white">Tap to pay</p>
            </div>
            <div className="relative mx-auto mt-4 grid size-10 place-items-center"><span className="tap absolute inset-0 rounded-full border-2 border-zinc-400" /><span className="text-zinc-400">)))</span></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
