"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

const css = `
.k-hpd .tap{animation:k-hpd-tap 2.4s ease-out infinite}
@keyframes k-hpd-tap{0%{transform:scale(.4);opacity:.8}100%{transform:scale(2.4);opacity:0}}
@media (prefers-reduced-motion:reduce){.k-hpd .tap{animation:none;opacity:0}}
[data-reduce-motion] .k-hpd .tap{animation:none;opacity:0}`;

/** Hardware hero: split card with a serif two-liner; a handheld terminal swings upright and its screen counts up a sale while contactless rings pulse. */
export function HeroPocketDevice({ product = "Pocket Terminal", lines = ["Fits in your pocket.", "Powers your day."], amount = 48.5, className }: { product?: string; lines?: string[]; amount?: number; className?: string }) {
  const reduced = useReducedMotion();
  const [v, setV] = useState(reduced ? amount : 0);
  useEffect(() => {
    if (reduced) return setV(amount);
    let raf = 0; const t0 = performance.now();
    const step = (t: number) => { const p = Math.min(1, (t - t0 - 600) / 1400); setV(p < 0 ? 0 : amount * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [amount, reduced]);
  return (
    <section className={cn("k-hpd bg-white p-6 text-zinc-900", className)}>
      <style href="k-hpd" precedence="kinetik">{css}</style>
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl bg-[#f2f2f2] md:grid-cols-2">
        <div className="flex flex-col justify-center gap-6 p-10">
          <p className="flex items-center gap-2 text-sm font-medium"><span className="bg-black px-1.5 py-0.5 text-[9px] font-bold text-white">NEW</span>{product}</p>
          <h1 className="font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl">{lines.map((l) => <span key={l} className="block">{l}</span>)}</h1>
          <div className="flex gap-3 text-sm font-medium"><a href="#" className="rounded-full border border-zinc-900 px-6 py-2.5 hover:bg-white">Learn more</a><a href="#" className="rounded-full bg-black px-6 py-2.5 text-white hover:bg-zinc-800">Buy now</a></div>
        </div>
        <div aria-hidden className="relative grid min-h-80 place-items-center bg-[#f7f7f7] [perspective:900px]">
          <motion.div initial={reduced ? false : { rotateX: 50, rotateZ: -18, y: 60, opacity: 0 }} animate={{ rotateX: 0, rotateZ: -8, y: 0, opacity: 1 }} transition={{ ...spring.smooth, delay: 0.2 }} className="relative h-72 w-36 rounded-[26px] bg-gradient-to-b from-zinc-100 to-zinc-300 p-2 shadow-[0_40px_60px_-20px_#0006]">
            <div className="flex h-[72%] flex-col items-center justify-center rounded-[18px] bg-white">
              <p className="text-[10px] text-zinc-500">Total</p>
              <p className="text-2xl font-semibold tabular-nums">${v.toFixed(2)}</p>
              <p className="mt-2 rounded-full bg-zinc-900 px-3 py-1 text-[9px] text-white">Tap to pay</p>
            </div>
            <div className="relative mx-auto mt-4 grid size-10 place-items-center"><span className="tap absolute inset-0 rounded-full border-2 border-zinc-500" /><span className="text-zinc-500">)))</span></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
