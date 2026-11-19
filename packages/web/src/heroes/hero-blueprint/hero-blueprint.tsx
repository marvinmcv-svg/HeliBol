"use client";
import { cn } from "@kinetik/core";

const FONT = "https://fonts.googleapis.com/css2?family=Archivo:wght@500;800;900&family=IBM+Plex+Mono:wght@400;500&display=swap";
const css = `
.k-hbp{font-family:Archivo,ui-sans-serif,system-ui,sans-serif}
.k-hbp .mono{font-family:"IBM Plex Mono",ui-monospace,monospace}
.k-hbp .draw{stroke-dasharray:var(--l,600);stroke-dashoffset:var(--l,600);animation:k-hbp-draw 2.4s cubic-bezier(.65,0,.35,1) forwards;animation-delay:var(--d,0s)}
@keyframes k-hbp-draw{to{stroke-dashoffset:0}}
.k-hbp .sun{transform-origin:center;transform-box:fill-box;animation:k-hbp-sun 1.4s cubic-bezier(.34,1.56,.64,1) .9s both}
@keyframes k-hbp-sun{from{transform:scale(0)}}
.k-hbp .pix{animation:k-hbp-pix 2.6s steps(4) infinite;animation-delay:var(--d)}
@keyframes k-hbp-pix{50%{opacity:0}}
.k-hbp .tick{animation:k-hbp-tick 22s linear infinite}
@keyframes k-hbp-tick{to{transform:translateX(-50%)}}
.k-hbp .rise{animation:k-hbp-rise .9s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hbp-rise{from{opacity:0;transform:translateY(16px)}}
@media (prefers-reduced-motion:reduce){.k-hbp *{animation:none!important;stroke-dashoffset:0!important}}
[data-reduce-motion] .k-hbp *{animation:none!important;stroke-dashoffset:0!important}`;

const ticks = ["Less busywork", "Faster iterations", "Fewer mistakes", "Less busywork", "Faster iterations", "Fewer mistakes"];
const clients = ["ALCOVE", "SKYLINE", "TERRA NOVA", "PINECREST", "VERTEX"];

/** Architectural AI-agent hero on a ruled cream grid: heavy two-line headline, mono ticker, a line-drawn tower with a red sun dissolving into pixels, a shouty statement and a client row. */
export function HeroBlueprint({ title = "An AI agent that works inside your design tools", statement = "The repetitive parts of modelling shouldn't eat your day. Egret handles the fiddly, manual work so you can stay focused on the design, not the software.", className }: { title?: string; statement?: string; className?: string }) {
  const floors = Array.from({ length: 16 }, (_, i) => 62 + i * 13);
  const fins = Array.from({ length: 12 }, (_, i) => 96 + i * 5);
  const line = "border-[#141414]/30";
  return (
    <section className={cn("k-hbp flex flex-col overflow-hidden bg-[#f1efe6] p-3 text-[#141414]", className)}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hbp" precedence="kinetik">{css}</style>
      <div className={cn("flex flex-1 flex-col border", line)}>
        <div className={cn("grid border-b md:grid-cols-[1fr_auto]", line)}>
          <h1 className="rise p-6 pb-5 text-[clamp(1.6rem,3.55vw,3.3rem)] leading-[.92] font-black tracking-[-.025em] uppercase">{title}</h1>
          <div className={cn("flex flex-col md:w-[42vw] md:border-l", line)}>
            <div className="flex flex-1">
            <p className="rise flex-1 p-4 text-[13px] leading-snug" style={{ ["--d" as string]: ".15s" }}>Egret reviews your model, identifies issues, and proposes solutions. Upon approval, it edits automatically. This concept crafted by <b className="underline">Northlight agency</b>, the award-winning design agency.</p>
            <a href="#" className={cn("mono flex w-[30%] flex-col justify-between border-l p-4 text-[11px] text-[#ff4a1c] uppercase", line)}>Discover more<span className="self-end text-lg">→</span></a>
            </div>
            <div className={cn("mono overflow-hidden border-t py-2 text-[10px] tracking-wide uppercase", line)}><div className="tick flex w-max gap-6 pr-6">{[...ticks, ...ticks].map((t, i) => <span key={i} aria-hidden={i >= ticks.length}>◎ {t}</span>)}</div></div>
          </div>
        </div>
        <div className="grid flex-1 md:grid-cols-2">
          <div className={cn("relative border-r", line)}>
            <svg viewBox="60 0 330 330" aria-hidden className="absolute inset-0 size-full" preserveAspectRatio="xMidYMax meet">
              <circle className="sun" cx="236" cy="112" r="64" fill="#ff4a1c" />
              <g fill="none" stroke="#141414" strokeWidth="1.1">
                <path className="draw" style={{ ["--l" as string]: 1400 }} d="M150 330 V40 L230 22 L262 34 V330 M150 40 L182 50 V330 M230 22 V330" />
                {floors.map((y, i) => <path key={y} className="draw" style={{ ["--l" as string]: 160, ["--d" as string]: `${0.3 + i * 0.06}s` }} d={`M182 ${y} L230 ${y - 10} L262 ${y + 2}`} />)}
                {fins.map((x, i) => <path key={x} className="draw" style={{ ["--l" as string]: 300, ["--d" as string]: `${0.5 + i * 0.05}s` }} d={`M${x + 54} ${46 + (i % 2) * 3} V 200`} strokeWidth="2.4" />)}
                <path className="draw" style={{ ["--l" as string]: 900, ["--d" as string]: ".7s" }} d="M0 270 H150 M10 270 V300 H150 M262 300 H330 L360 290 H400 M40 300 L70 330 M262 250 H300 V300" />
              </g>
              <g fill="#fff">{Array.from({ length: 22 }, (_, i) => <rect key={i} className="pix" x={150 + ((i * 37) % 112)} y={196 + ((i * 13) % 26)} width={6 + (i % 3) * 3} height="6" style={{ ["--d" as string]: `${-(i % 7) * 0.3}s` }} />)}</g>
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-1 flex-col justify-center gap-7 py-8 pr-[14%] pl-[17%]">
              <p className="rise text-[clamp(1.1rem,2.45vw,2.3rem)] leading-[.98] font-extrabold tracking-[-.01em] uppercase" style={{ ["--d" as string]: ".5s" }}>{statement}</p>
              <a href="#" className={cn("mono rise flex w-fit items-center border text-[10px] uppercase transition-colors hover:bg-black hover:text-white", line)} style={{ ["--d" as string]: ".65s" }}><span className="px-3 py-2.5">Learn more</span><span className={cn("border-l px-3 py-2.5", line)}>→</span></a>
            </div>
            <div className={cn("mono flex justify-between border-t border-b text-[10px] uppercase", line)}><span className="p-2">Clients</span><span className="flex"><span className={cn("border-l px-4 py-2", line)}>←</span><span className={cn("border-l px-4 py-2", line)}>→</span></span></div>
            <ul className="grid grid-cols-5">{clients.map((c) => <li key={c} className={cn("grid h-20 place-items-center border-r text-center text-[10px] font-medium tracking-[.2em] last:border-r-0", line)}><span><span aria-hidden className="block text-lg">⌂</span>{c}</span></li>)}</ul>
          </div>
        </div>
        <p className={cn("mono border-t px-3 py-1.5 text-[9px] uppercase", line)}>Works natively inside the tools you already use, including Revit, Rhino, ArchiCAD and SketchUp.</p>
      </div>
    </section>
  );
}
