"use client";
import { cn } from "@kinetik/core";

const css = `
.k-hsu .stripe{animation:k-hsu-slide 1.1s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(.2s + var(--i)*90ms)}
@keyframes k-hsu-slide{from{transform:translateX(var(--from))}}
.k-hsu .cat{animation:k-hsu-cat 1.2s steps(2) infinite,k-hsu-walk 14s linear infinite alternate}
@keyframes k-hsu-cat{50%{transform:translateY(-3px)}}
@keyframes k-hsu-walk{from{margin-left:10%}to{margin-left:80%}}
.k-hsu .lnk span{transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
.k-hsu .lnk:hover span{transform:translateX(4px)}
@media (prefers-reduced-motion:reduce){.k-hsu *{animation:none!important}}
[data-reduce-motion] .k-hsu *{animation:none!important}`;

const stripes = ["#fbe7b5", "#ffd400", "#ffaf00", "#ff8205", "#fa500f", "#e10500"];
const cat = ["1000001", "1100011", "1111111", "1011101", "1111111", "0111110"];

/** Closing/CTA-style hero: plain centered statement with underlined text links, sitting on stacked sunset stripes that sweep in from alternating sides while a pixel cat strolls along. */
export function HeroSunsetStripes({ title = "The next chapter of AI is yours.", links = ["Start building", "Talk to an expert"], className }: { title?: string; links?: string[]; className?: string }) {
  return (
    <section className={cn("k-hsu overflow-hidden bg-[#fff8e7] pt-14 text-center text-[#1e1e1e]", className)}>
      <style href="k-hsu" precedence="kinetik">{css}</style>
      <h1 className="px-6 text-4xl tracking-tight sm:text-5xl">{title}</h1>
      <div className="mt-6 flex justify-center gap-8 text-sm">
        {links.map((l) => <a key={l} href="#" className="lnk border-b border-current pb-1">{l} <span className="inline-block text-[#fa500f]">›</span></a>)}
      </div>
      <svg aria-hidden viewBox="0 0 7 6" className="cat mt-10 block h-8 w-10" shapeRendering="crispEdges">{cat.flatMap((r, y) => [...r].map((v, x) => (v === "1" ? <rect key={`${x}${y}`} x={x} y={y} width="1" height="1" fill="#111" /> : null)))}</svg>
      <div aria-hidden>{stripes.map((c, i) => <div key={c} className="stripe h-7" style={{ background: c, ["--i" as string]: i, ["--from" as string]: i % 2 ? "100%" : "-100%" }} />)}</div>
    </section>
  );
}
