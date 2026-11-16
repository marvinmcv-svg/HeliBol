"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

const FONT = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500&display=swap";
const css = `.k-hsl .logos{animation:k-hsl-m 30s linear infinite}@keyframes k-hsl-m{to{transform:translateX(-50%)}}@media (prefers-reduced-motion:reduce){.k-hsl .logos{animation:none}}[data-reduce-motion] .k-hsl .logos{animation:none}`;
const logos = ["⚡ hotspot", "● recharger", "VWX", "omnisend", "◆ klaviyo", "▲ northbeam"];

/** Capability hero: pill-menu header, "AI that" in a ruled left column, a slot-reel of huge phrases that springs up one row at a time (current row in full ink), and a drifting "Trusted by" logo row. */
export function HeroSlotRows({ lead = "AI that", phrases = ["Writes copy", "Makes videos", "Stays on-brand", "Create Images", "Ships campaigns", "Learns your voice"], className }: { lead?: string; phrases?: string[]; className?: string }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(1);
  useEffect(() => {
    if (reduced) return;
    let t: ReturnType<typeof setInterval>;
    const first = setTimeout(() => { setI((k) => (k + 1) % phrases.length); t = setInterval(() => setI((k) => (k + 1) % phrases.length), 2400); }, 5000);
    return () => { clearTimeout(first); clearInterval(t); };
  }, [reduced, phrases.length]);
  const rule = "border-[#e4e4e4]";
  return (
    <section className={cn("k-hsl flex flex-col overflow-hidden bg-white text-[#141414]", className)} style={{ fontFamily: '"Inter Tight",ui-sans-serif,sans-serif' }}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hsl" precedence="kinetik">{css}</style>
      <header className="relative flex items-start justify-between px-[1.8%] pt-[1.3%]">
        <span aria-hidden className="grid grid-cols-3 gap-px">{[1, 1, 1, 1, 0, 0, 1, 1, 0].map((v, k) => <i key={k} className={cn("block size-3", v ? "bg-black" : "bg-transparent")} />)}</span>
        <span className="absolute left-1/2 flex -translate-x-1/2 items-center gap-6 rounded-full bg-[#111] py-1.5 pr-1.5 pl-4 text-[13px] text-white"><span className="flex items-center gap-2">☰ Menu</span><span aria-hidden>●</span><span className="rounded-full bg-white/20 px-2 py-0.5 text-[12px]">35%</span></span>
        <span className="flex items-center gap-3"><span aria-hidden className="grid size-6 place-items-center rounded-full border text-[10px]">◉</span><a href="#" className="rounded-full bg-black px-5 py-2.5 text-[13px] text-white">Get started</a></span>
      </header>
      <p className="ml-[28%] pt-3 pb-2 text-[13px]">How It Works</p>
      <div className={cn("grid border-y md:grid-cols-[26.3%_1fr]", rule)}>
        <div className={cn("flex flex-col justify-between border-r px-[7%] py-[8%]", rule)}>
          <h1 className="text-[clamp(2.6rem,5.6vw,5.4rem)] leading-[.95] tracking-[-.04em]">{lead}<span className="sr-only"> {phrases.join(", ")}</span></h1>
          <a href="#" className="mt-10 w-fit rounded-full bg-black px-4 py-2.5 text-[12px] text-white">Get started</a>
        </div>
        <div aria-hidden className="relative h-[clamp(14rem,36vw,34rem)] overflow-hidden">
          <motion.ul animate={{ y: `${-i * 33.33 + 5}%` }} transition={reduced ? { duration: 0 } : spring.smooth} className="absolute inset-x-0 top-0 h-full">
            {phrases.map((p, k) => (
              <li key={p} className={cn("flex h-[33.33%] items-center border-b px-[2%] text-[clamp(2.6rem,6.2vw,6rem)] tracking-[-.045em] transition-colors duration-500", rule, k === i ? "text-[#141414]" : k === i + 1 ? "text-[#6e6e6e]" : k === i + 2 ? "text-[#bdbdbd]" : "text-[#e2e2e2]")}>{p}</li>
            ))}
          </motion.ul>
        </div>
      </div>
      <div className="flex flex-1 items-start">
        <p className="w-[26.3%] shrink-0 px-[1.8%] pt-3 text-[12px]">Trusted By</p>
        <div className="flex-1 overflow-hidden pt-3 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"><div aria-hidden className="logos flex w-max gap-3">{[...logos, ...logos].map((l, k) => <span key={k} className="grid h-[clamp(5rem,11vw,10.5rem)] w-[clamp(7rem,14.5vw,14rem)] place-items-center bg-[#f1f1f1] text-[13px] font-semibold text-zinc-600">{l}</span>)}</div></div>
      </div>
    </section>
  );
}
