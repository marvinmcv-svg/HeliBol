"use client";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";
import { easeBezier } from "@kinetik/tokens";

const css = `
@property --oa{syntax:"<angle>";initial-value:0deg;inherits:false}
.k-hoc .orb{background:conic-gradient(from var(--oa),#ff6b6b,#ffb199,#f8c4ff,#ff8fab,#ff6b6b);animation:k-hoc-spin 14s linear infinite}
@keyframes k-hoc-spin{to{--oa:360deg}}
.k-hoc .plus{transition:transform .5s cubic-bezier(.34,1.56,.64,1)}
.k-hoc .card:hover .plus{transform:rotate(135deg)}
@media (prefers-reduced-motion:reduce){.k-hoc .orb{animation:none}}
[data-reduce-motion] .k-hoc .orb{animation:none}`;

type Client = { name: string; art: string };
const defaults: Client[] = [
  { name: "Jasmine.ai", art: "linear-gradient(160deg,#fde4cf,#c084fc 70%,#6d28d9)" },
  { name: "Tilman Fiber", art: "linear-gradient(160deg,#e0f2fe,#38bdf8 60%,#1d4ed8)" },
  { name: "Nightjar", art: "linear-gradient(160deg,#18181b,#3f3f46 60%,#a3e635)" },
];

/** Agency hero: a huge rotating conic orb bleeding in from the corner, chunky pill CTAs and client case cards that fan into place. */
export function HeroOrbClients({ intro = "We create scalable digital experiences that help you make an impact — websites that speak to your audience and help you stand out.", clients = defaults, className }: { intro?: string; clients?: Client[]; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <section className={cn("k-hoc relative overflow-hidden bg-[#e9e7e3] px-6 py-10 text-zinc-900", className)}>
      <style href="k-hoc" precedence="kinetik">{css}</style>
      <div aria-hidden className="orb absolute -top-40 -right-24 size-[34rem] rounded-full opacity-80 blur-2xl" />
      <div className="relative flex flex-wrap items-start justify-between gap-6">
        <p className="text-xl font-medium tracking-tight">OFF/GRID.</p>
        <div className="flex flex-wrap gap-3">
          {["Go big", "Capabilities deck"].map((t) => <a key={t} href="#" className="group rounded-full bg-white/70 px-6 py-4 text-lg font-medium uppercase backdrop-blur transition-colors hover:bg-white">{t} <span className="inline-block transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span></a>)}
        </div>
      </div>
      <div className="relative mt-8 grid items-end gap-6 md:grid-cols-[1fr_2.2fr]">
        <div><h1 className="text-sm leading-relaxed text-zinc-700">{intro}</h1><p className="mt-6 text-xs tracking-widest text-zinc-500 uppercase">Our clients</p></div>
        <ul className="flex gap-4">
          {clients.map((c, i) => (
            <motion.li key={c.name} initial={reduced ? false : { opacity: 0, x: 80, rotate: 6 }} animate={{ opacity: 1, x: 0, rotate: 0 }} transition={{ delay: 0.15 + i * 0.12, duration: 0.9, ease: easeBezier.expoOut }} className="card relative h-56 flex-1 overflow-hidden rounded-2xl border border-black/10 p-4" style={{ background: c.art }}>
              <div className="flex items-start justify-between text-xs font-medium tracking-wide uppercase mix-blend-difference text-white"><span>{c.name}</span><span className="plus text-2xl leading-none">+</span></div>
              <a href="#" className="absolute bottom-4 left-4 rounded-full bg-white/80 px-3 py-1.5 text-[10px] font-medium uppercase backdrop-blur">View case study →</a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
