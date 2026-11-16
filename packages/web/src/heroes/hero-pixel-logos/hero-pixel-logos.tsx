"use client";
import { cn } from "@kinetik/core";

const css = `
.k-hpl .px{animation:k-hpl-hop 2.4s cubic-bezier(.34,1.56,.64,1) infinite;animation-delay:var(--d)}
@keyframes k-hpl-hop{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px) rotate(-6deg)}}
.k-hpl .cells{animation:k-hpl-slide 36s linear infinite}
@keyframes k-hpl-slide{to{transform:translateX(-50%)}}
.k-hpl .w{display:inline-block;animation:k-hpl-word .7s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(var(--i)*35ms)}
@keyframes k-hpl-word{from{opacity:0;transform:translateY(.4em)}}
.k-hpl .story{animation:k-hpl-story 1.2s cubic-bezier(.16,1,.3,1) .6s both}
@keyframes k-hpl-story{from{opacity:0;transform:translateY(40px)}}
@media (prefers-reduced-motion:reduce){.k-hpl *{animation:none!important}}
[data-reduce-motion] .k-hpl *{animation:none!important}`;

const sprites = [
  { c: ["#f97316", "#7c2d12", "#fbbf24"], m: ["00000000", "01111110", "12222221", "12122121", "12211221", "12222221", "01111110"] },
  { c: ["#1d4ed8", "#0b1a4a", "#93c5fd"], m: ["00011000", "01111110", "12211221", "11111111", "13333331", "11111111", "01100110"] },
  { c: ["#0ea5e9", "#1e3a8a", "#22c55e"], m: ["00111100", "01133310", "11333111", "13311331", "11113311", "01111110", "00111100"] },
];
const logos = ["✕ HTX", "AXA·", "orange■", "I B M", "ASML", "MINISTÈRE", "NOVA", "KESTREL"];
const nav = ["Products", "Solutions", "Models", "Developers", "Blog", "Customers", "Company"];

/** Enterprise-AI hero in a ruled grid: bordered cell nav, hopping pixel-art mascots, a word-by-word headline, a drifting row of tall logo cells and a strip of customer stories. */
export function HeroPixelLogos({ title = "We help organizations build tailored AI systems to solve the world's hardest problems.", className }: { title?: string; className?: string }) {
  const rule = "border-[#e7e5df]";
  return (
    <section className={cn("k-hpl flex flex-col overflow-hidden bg-[#fbfaf7] text-[#111]", className)}>
      <style href="k-hpl" precedence="kinetik">{css}</style>
      <nav className={cn("flex border-b text-[13px] whitespace-nowrap", rule)}>
        <span aria-hidden className={cn("grid w-11 place-items-center border-r", rule)}><svg viewBox="0 0 7 5" className="w-6" shapeRendering="crispEdges">{["1000001", "1101011", "1111111", "1010101", "1000001"].flatMap((r, y) => [...r].map((v, x) => v === "1" && <rect key={`${x}${y}`} x={x} y={y} width="1" height="1" fill={["#ffd800", "#ffaf00", "#ff8205", "#fa500f", "#e10500"][y]} />))}</svg></span>
        {nav.map((n, k) => <a key={n} href="#" className={cn("border-r px-3.5 py-2.5", k > 2 && "hidden lg:block", rule)}>{n}</a>)}
        <span className="ml-auto flex"><a href="#" className={cn("border-l px-4 py-2.5", rule)}>Start building ⌄</a><a href="#" className="bg-black px-5 py-2.5 text-white">Contact sales ›</a></span>
      </nav>
      <div className={cn("mx-[0.4%] border-x border-b px-6 pt-2 pb-[6%] text-center", rule)}>
        <div aria-hidden className="flex justify-center gap-4">
          {sprites.map((s, k) => (
            <svg key={k} viewBox="0 0 8 7" className="px h-9 w-10" style={{ ["--d" as string]: `${k * 0.2}s` }} shapeRendering="crispEdges">
              {s.m.flatMap((row, y) => [...row].map((v, x) => (v === "0" ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={s.c[+v - 1]} />)))}
            </svg>
          ))}
        </div>
        <h1 className="mx-auto mt-1 max-w-[21ch] text-[clamp(2rem,3.9vw,3.6rem)] leading-[1.12] font-medium tracking-[-.03em]">
          {title.split(" ").map((w, i) => <span key={i} className="w" style={{ ["--i" as string]: i }}>{w}&nbsp;</span>)}
        </h1>
      </div>
      <div className={cn("overflow-hidden border-b", rule)}>
        <ul className="cells flex w-max">
          {[...logos, ...logos].map((l, i) => <li key={i} aria-hidden={i >= logos.length} className={cn("grid h-[clamp(7rem,17vw,15rem)] w-[clamp(9rem,17.9vw,16.5rem)] place-items-center border-r text-[clamp(1rem,2vw,1.9rem)] font-black tracking-tight", rule)}>{l}</li>)}
        </ul>
      </div>
      <div aria-hidden className={cn("story grid flex-1 grid-cols-[12.5%_1fr_12.5%] gap-2 pt-[6%] text-[11px] font-medium", rule)}>
        <div className="flex flex-col justify-end gap-1 pl-4"><span>Stellar accelerates…</span><span className="h-16 rounded bg-gradient-to-br from-[#3a2c22] via-[#c2410c] to-[#1c1917]" /></div>
        <div className="relative rounded-t-lg bg-gradient-to-r from-[#1f2a37] via-[#7c3a12] to-[#3a3f47]"><span className="absolute top-4 left-4 text-base font-bold text-white">⟷ HALDEN</span><span className="absolute bottom-3 left-4 rounded bg-black/40 px-1.5 font-mono text-[9px] text-white">FINANCIAL SERVICES</span></div>
        <div className="flex flex-col justify-end gap-1 pr-4"><span>Axiom accelerates…</span><span className="h-16 rounded bg-[radial-gradient(circle,#f97316,#7c2d12_60%,#111)]" /></div>
      </div>
    </section>
  );
}
