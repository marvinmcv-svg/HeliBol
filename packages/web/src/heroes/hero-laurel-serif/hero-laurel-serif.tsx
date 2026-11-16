"use client";
import { cn } from "@kinetik/core";

const css = `
.k-hls .ch{display:inline-block;white-space:pre;animation:k-hls-ch .8s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(var(--i)*28ms)}
@keyframes k-hls-ch{from{opacity:0;transform:translateY(.25em);filter:blur(4px)}}
.k-hls .award{animation:k-hls-aw .6s ease-out both;animation-delay:calc(.8s + var(--i)*70ms)}
@keyframes k-hls-aw{from{opacity:0;transform:scale(.8)}}
.k-hls .slab{animation:k-hls-slab 1.2s cubic-bezier(.16,1,.3,1) 1.2s both}
@keyframes k-hls-slab{from{transform:translateY(100%)}}
@media (prefers-reduced-motion:reduce){.k-hls *{animation:none!important}}
[data-reduce-motion] .k-hls *{animation:none!important}`;

/** Quiet agency hero: a single serif line types itself in, laurel-wrapped awards pop in a grid, and a neon slab rises from the fold. */
export function HeroLaurelSerif({ title = "Rewrite your worth.", awards = ["AdAge 2019", "AdAge 2020", "AdAge 2021", "D&AD 2021", "AdAge 2023", "AdAge 2024", "AdAge 2025"], className }: { title?: string; awards?: string[]; className?: string }) {
  return (
    <section className={cn("k-hls relative flex min-h-[460px] flex-col overflow-hidden bg-[#f7f7f5] text-[#1b1414]", className)}>
      <style href="k-hls" precedence="kinetik">{css}</style>
      <nav className="flex items-center justify-between px-8 py-5 text-xs font-semibold tracking-[.2em]"><span>HOLLIS</span><span aria-hidden className="text-lg">≡</span></nav>
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-28 text-center">
        <h1 aria-label={title} className="font-serif text-[clamp(2.2rem,6vw,3.8rem)] tracking-tight">{[...title].map((c, i) => <span key={i} aria-hidden className="ch" style={{ ["--i" as string]: i }}>{c}</span>)}</h1>
        <p className="mt-14 text-[10px] text-zinc-500">7× Agency of the Year</p>
        <ul className="mt-3 flex max-w-sm flex-wrap justify-center gap-x-5 gap-y-2 text-[10px] text-zinc-700">
          {awards.map((a, i) => <li key={a} className="award" style={{ ["--i" as string]: i }}><span aria-hidden>❦ </span>{a}<span aria-hidden> ❦</span></li>)}
        </ul>
      </div>
      <div aria-hidden className="slab absolute inset-x-[12%] bottom-0 h-20 rounded-t-xl bg-[#00e83a]" />
    </section>
  );
}
