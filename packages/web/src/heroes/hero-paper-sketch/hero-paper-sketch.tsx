"use client";
import { cn } from "@kinetik/core";

const FONT = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;600&display=swap";
const css = `
.k-hps{font-family:Inter,ui-sans-serif,system-ui,sans-serif}
.k-hps .s{stroke-dasharray:var(--l);stroke-dashoffset:var(--l);animation:k-hps-draw var(--t) ease-in-out forwards;animation-delay:var(--d)}
@keyframes k-hps-draw{to{stroke-dashoffset:0}}
.k-hps .tab{animation:k-hps-tilt 9s ease-in-out infinite alternate}
@keyframes k-hps-tilt{from{transform:rotate(-9deg)}to{transform:rotate(-6deg) translateY(-6px)}}
.k-hps .in{animation:k-hps-in 1s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hps-in{from{opacity:0;transform:translateY(14px)}}
@media (prefers-reduced-motion:reduce){.k-hps *{animation:none!important;stroke-dashoffset:0!important}}
[data-reduce-motion] .k-hps *{animation:none!important;stroke-dashoffset:0!important}`;

const features = [["▣", "Smooth interactions", "Scroll, zoom, turn pages— even watch video— without any lag"], ["☺", "A calm experience", "Stay connected with yourself and what's around you"], ["♡", "For your health", "Say goodbye to eye-strain —designed for full sunlight and nighttime"]];

/** Device hero in a rounded cinematic frame: a large tilted paper-like tablet sketches an engraving stroke by stroke beside a hand, under a frosted nav pill, with serif copy and three features along the bottom. */
export function HeroPaperSketch({ title = "The world's first full-speed", italic = "paper-like", tail = "display", className }: { title?: string; italic?: string; tail?: string; className?: string }) {
  const contours = Array.from({ length: 14 }, (_, i) => `M${80 + i * 3} ${60 + i * 9} C ${110 + i * 4} ${20 + i * 7}, ${190 - i * 3} ${30 + i * 8}, ${205 - i * 3} ${90 + i * 7} S ${150} ${215 - i * 5}, ${95 + i * 4} ${165 - i * 3} Z`);
  return (
    <section className={cn("k-hps flex bg-[#efebe4] p-[1.4%]", className)}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hps" precedence="kinetik">{css}</style>
      <div className="relative min-h-[440px] flex-1 overflow-hidden rounded-2xl bg-[radial-gradient(ellipse_at_35%_35%,#4a4038,#2a2420_55%,#1d1916)] text-white">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_75%,#7a3a3a55,transparent_40%),radial-gradient(ellipse_at_80%_55%,#6b6b6b33,transparent_35%)]" />
        <span aria-hidden className="absolute top-4 left-4 grid size-8 place-items-center rounded-lg bg-white/85 text-zinc-800">◑</span>
        <nav className="absolute top-3 right-3 z-10 flex items-center gap-5 rounded-xl bg-white/70 py-1 pr-1 pl-4 text-[12px] text-zinc-700 backdrop-blur"><span>Home</span><span>Product</span><span>FAQ</span><a href="#" className="rounded-lg bg-[#ff8a1f] px-4 py-2.5 text-[11px] font-semibold text-[#2a1404]">ORDER NOW</a></nav>
        <div aria-hidden className="tab absolute top-[6%] left-[16%] w-[42%] rounded-[34px] bg-gradient-to-br from-[#f08a3a] to-[#c95a1c] p-[2%] shadow-2xl">
          <div className="rounded-[22px] bg-[#e8e3d4] p-[3%] shadow-inner">
            <svg viewBox="0 0 280 260" className="block w-full">
              <g fill="none" stroke="#33332f" strokeWidth=".7">{contours.map((d, i) => <path key={i} className="s" d={d} style={{ ["--l" as string]: 620, ["--t" as string]: "2.6s", ["--d" as string]: `${0.3 + i * 0.14}s` }} />)}</g>
              <g stroke="#33332f" strokeWidth=".5" fill="none">{Array.from({ length: 6 }, (_, i) => <path key={i} className="s" d={`M10 ${150 + i * 6} Q 140 ${120 + i * 10} 270 ${150 + i * 6}`} style={{ ["--l" as string]: 300, ["--t" as string]: "1.4s", ["--d" as string]: `${1.6 + i * 0.1}s` }} />)}{Array.from({ length: 6 }, (_, i) => <path key={`v${i}`} className="s" d={`M${125 + i * 6} 225 V 258`} style={{ ["--l" as string]: 40, ["--t" as string]: ".4s", ["--d" as string]: `${2.4 + i * 0.08}s` }} />)}</g>
            </svg>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 grid grid-cols-[2.3fr_1fr_1fr_1fr] items-end gap-[2%] bg-gradient-to-t from-black/55 to-transparent px-[3.5%] pt-24 pb-[3%]">
          <h1 className="in text-[clamp(1.8rem,4.2vw,3.9rem)] leading-[1] tracking-[-.04em]" style={{ fontFamily: '"Instrument Serif",serif' }}>{title} <em>{italic}</em> {tail}</h1>
          {features.map(([icon, h, p], i) => <div key={h} className="in text-[clamp(.6rem,.95vw,.9rem)]" style={{ ["--d" as string]: `${0.2 + i * 0.1}s` }}><span aria-hidden className="text-xl">{icon}</span><p className="mt-2 text-[1.15em] font-semibold">{h}</p><p className="mt-1 text-white/70">{p}</p></div>)}
        </div>
      </div>
    </section>
  );
}
