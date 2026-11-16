"use client";
import { cn } from "@kinetik/core";

const css = `
.k-hbp .draw{stroke-dasharray:var(--l,600);stroke-dashoffset:var(--l,600);animation:k-hbp-draw 2.4s cubic-bezier(.65,0,.35,1) forwards;animation-delay:var(--d,0s)}
@keyframes k-hbp-draw{to{stroke-dashoffset:0}}
.k-hbp .sun{transform-origin:center;transform-box:fill-box;animation:k-hbp-sun 1.4s cubic-bezier(.34,1.56,.64,1) .9s both}
@keyframes k-hbp-sun{from{transform:scale(0)}}
.k-hbp .tick{animation:k-hbp-tick 18s linear infinite}
@keyframes k-hbp-tick{to{transform:translateX(-50%)}}
.k-hbp .rise{animation:k-hbp-rise .9s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hbp-rise{from{opacity:0;transform:translateY(16px)}}
@media (prefers-reduced-motion:reduce){.k-hbp *{animation:none!important;stroke-dashoffset:0!important}}
[data-reduce-motion] .k-hbp *{animation:none!important;stroke-dashoffset:0!important}`;

const ticks = ["Less busywork", "Faster iterations", "Fewer mistakes", "Native in your tools", "Reviews every model"];

/** Architectural/AI-tool hero on a ruled editorial grid: line-art tower drawn stroke by stroke, a red sun popping behind it and a mono ticker. */
export function HeroBlueprint({ title = "An AI agent that works inside your design tools", statement = "The repetitive parts of modelling shouldn't eat your day.", className }: { title?: string; statement?: string; className?: string }) {
  const floors = Array.from({ length: 11 }, (_, i) => 70 + i * 18);
  return (
    <section className={cn("k-hbp relative overflow-hidden bg-[#f1efe8] font-sans text-[#141414]", className)}>
      <style href="k-hbp" precedence="kinetik">{css}</style>
      <div className="grid border-b border-black/20 md:grid-cols-[1.6fr_1fr]">
        <h1 className="rise p-5 text-3xl leading-[.95] font-black tracking-tight uppercase sm:text-4xl">{title}</h1>
        <div className="rise border-black/20 p-5 text-xs md:border-l" style={{ ["--d" as string]: ".15s" }}>
          <p>Reviews your model, flags issues and proposes fixes. On approval it edits automatically.</p>
          <a href="#" className="mt-3 inline-block font-mono text-[10px] tracking-widest text-[#ff4a1c] uppercase">Discover more →</a>
        </div>
      </div>
      <div className="overflow-hidden border-b border-black/20 py-1.5 font-mono text-[10px] tracking-widest uppercase">
        <div className="tick flex w-max gap-8 pr-8">{[...ticks, ...ticks].map((t, i) => <span key={i} aria-hidden={i >= ticks.length}>◎ {t}</span>)}</div>
      </div>
      <div className="grid md:grid-cols-[1fr_1fr]">
        <svg viewBox="0 0 320 280" aria-hidden className="h-64 w-full border-black/20 md:border-r">
          <circle className="sun" cx="190" cy="95" r="58" fill="#ff4a1c" />
          <g fill="none" stroke="#141414" strokeWidth="1.2">
            <path className="draw" style={{ ["--l" as string]: 900 }} d="M110 270 V60 L200 40 V270 M200 40 L235 62 V270 M110 60 L150 70 V270" />
            {floors.map((y, i) => <path key={y} className="draw" style={{ ["--l" as string]: 140, ["--d" as string]: `${0.4 + i * 0.08}s` }} d={`M110 ${y} L150 ${y + 8} L200 ${y - 12} L235 ${y + 6}`} />)}
            <path className="draw" style={{ ["--l" as string]: 700, ["--d" as string]: ".6s" }} d="M10 270 H310 M30 270 V215 H110 M235 230 H300 V270" />
          </g>
        </svg>
        <div className="flex flex-col justify-center gap-5 p-6">
          <p className="rise text-xl leading-tight font-black uppercase" style={{ ["--d" as string]: ".5s" }}>{statement}</p>
          <a href="#" className="rise w-fit border border-black/40 px-3 py-2 font-mono text-[10px] tracking-widest uppercase transition-colors hover:bg-black hover:text-white" style={{ ["--d" as string]: ".65s" }}>Learn more →</a>
        </div>
      </div>
    </section>
  );
}
