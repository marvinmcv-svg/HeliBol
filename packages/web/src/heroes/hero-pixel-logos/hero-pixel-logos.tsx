"use client";
import { cn } from "@kinetik/core";

const css = `
.k-hpl .px{animation:k-hpl-hop 2.4s cubic-bezier(.34,1.56,.64,1) infinite;animation-delay:var(--d)}
@keyframes k-hpl-hop{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-8px) rotate(-6deg)}}
.k-hpl .cells{animation:k-hpl-slide 24s linear infinite}
@keyframes k-hpl-slide{to{transform:translateX(-50%)}}
.k-hpl .w{display:inline-block;animation:k-hpl-word .7s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(var(--i)*35ms)}
@keyframes k-hpl-word{from{opacity:0;transform:translateY(.4em)}}
@media (prefers-reduced-motion:reduce){.k-hpl *{animation:none!important}}
[data-reduce-motion] .k-hpl *{animation:none!important}`;

const sprites = [
  { c: ["#f97316", "#fbbf24"], m: ["01111110", "11111111", "11011011", "11111111", "11100111", "01111110"] },
  { c: ["#2563eb", "#93c5fd"], m: ["00100100", "01111110", "11011011", "11111111", "01011010", "01000010"] },
  { c: ["#0ea5e9", "#22c55e"], m: ["00111100", "01122110", "11211211", "11122111", "01121110", "00111100"] },
];

/** Enterprise AI hero: hopping pixel-art mascots, a word-by-word headline and a ruled grid of customer logo cells that drifts sideways. */
export function HeroPixelLogos({ title = "We help organizations build tailored AI systems to solve the world's hardest problems.", logos = ["HTX", "AXIOM", "orange/box", "IBEX", "ASMEL", "MINISTRY", "NOVA", "KESTREL"], className }: { title?: string; logos?: string[]; className?: string }) {
  return (
    <section className={cn("k-hpl overflow-hidden bg-[#fbfaf7] text-zinc-900", className)}>
      <style href="k-hpl" precedence="kinetik">{css}</style>
      <div className="border-b border-zinc-200 px-6 py-10 text-center">
        <div aria-hidden className="flex justify-center gap-3">
          {sprites.map((s, k) => (
            <svg key={k} viewBox="0 0 8 6" className="px h-6 w-8" style={{ ["--d" as string]: `${k * 0.2}s`, imageRendering: "pixelated" }} shapeRendering="crispEdges">
              {s.m.flatMap((row, y) => [...row].map((v, x) => (v === "0" ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={s.c[v === "2" ? 1 : 0]} />)))}
            </svg>
          ))}
        </div>
        <h1 className="mx-auto mt-4 max-w-xl text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
          {title.split(" ").map((w, i) => <span key={i} className="w" style={{ ["--i" as string]: i }}>{w}&nbsp;</span>)}
        </h1>
      </div>
      <div className="overflow-hidden border-b border-zinc-200">
        <ul className="cells flex w-max">
          {[...logos, ...logos].map((l, i) => <li key={i} aria-hidden={i >= logos.length} className="grid h-24 w-40 place-items-center border-r border-zinc-200 text-lg font-black tracking-tight text-zinc-800">{l}</li>)}
        </ul>
      </div>
    </section>
  );
}
