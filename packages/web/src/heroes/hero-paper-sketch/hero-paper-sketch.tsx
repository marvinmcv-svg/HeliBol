"use client";
import { cn } from "@kinetik/core";

const css = `
.k-hps .s{stroke-dasharray:var(--l);stroke-dashoffset:var(--l);animation:k-hps-draw var(--t) ease-in-out forwards;animation-delay:var(--d)}
@keyframes k-hps-draw{to{stroke-dashoffset:0}}
.k-hps .tab{animation:k-hps-tilt 9s ease-in-out infinite alternate}
@keyframes k-hps-tilt{from{transform:rotate(-7deg)}to{transform:rotate(-3deg) translateY(-6px)}}
.k-hps .in{animation:k-hps-in 1s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hps-in{from{opacity:0;transform:translateY(14px)}}
@media (prefers-reduced-motion:reduce){.k-hps *{animation:none!important;stroke-dashoffset:0!important}}
[data-reduce-motion] .k-hps *{animation:none!important;stroke-dashoffset:0!important}`;

const features = [["◫", "Smooth interactions", "Scroll, zoom, turn pages — even watch video — without lag."], ["☺", "A calm experience", "Stay connected with yourself and what's around you."], ["♡", "For your health", "No eye strain — designed for full sunlight and nighttime."]];

/** Device hero in a warm cinematic frame: a tilted paper-like tablet sketches an engraving stroke by stroke while serif copy and features rise. */
export function HeroPaperSketch({ title = "The first full-speed", italic = "paper-like", tail = "display", className }: { title?: string; italic?: string; tail?: string; className?: string }) {
  const contours = Array.from({ length: 9 }, (_, i) => `M${60 + i * 4} ${40 + i * 10} C ${90 + i * 6} ${10 + i * 8}, ${160 - i * 4} ${20 + i * 9}, ${170 - i * 3} ${70 + i * 8} S ${120} ${170 - i * 6}, ${70 + i * 5} ${130 - i * 4} Z`);
  return (
    <section className={cn("k-hps bg-[#efe9df] p-3", className)}>
      <style href="k-hps" precedence="kinetik">{css}</style>
      <div className="relative min-h-[440px] overflow-hidden rounded-2xl bg-[radial-gradient(ellipse_at_30%_20%,#5b4636,#2a211b_70%)] text-white">
        <nav className="absolute top-3 right-3 z-10 flex items-center gap-4 rounded-xl bg-white/80 px-3 py-1.5 text-[11px] text-zinc-800 backdrop-blur"><span>Home</span><span>Product</span><span>FAQ</span><a href="#" className="rounded-md bg-[#ff8a1f] px-3 py-1.5 font-semibold text-black">ORDER NOW</a></nav>
        <div aria-hidden className="tab absolute top-6 left-[12%] w-60 rounded-[22px] bg-[#e5732b] p-3 shadow-2xl">
          <svg viewBox="0 0 230 200" className="block w-full rounded-xl bg-[#e9e4d6]">
            <g fill="none" stroke="#3a3a36" strokeWidth=".8">{contours.map((d, i) => <path key={i} className="s" d={d} style={{ ["--l" as string]: 520, ["--t" as string]: "2.4s", ["--d" as string]: `${0.3 + i * 0.18}s` }} />)}</g>
            <g stroke="#3a3a36" strokeWidth=".6">{Array.from({ length: 5 }, (_, i) => <path key={i} className="s" d={`M${100 + i * 6} 175 V 198`} style={{ ["--l" as string]: 30, ["--t" as string]: ".4s", ["--d" as string]: `${2 + i * 0.1}s` }} />)}</g>
          </svg>
        </div>
        <div className="absolute inset-x-0 bottom-0 grid gap-6 bg-gradient-to-t from-black/60 to-transparent p-6 pt-20 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <h1 className="in font-serif text-3xl leading-[1.05] tracking-tight">{title} <em>{italic}</em> {tail}</h1>
          {features.map(([icon, h, p], i) => <div key={h} className="in text-[11px]" style={{ ["--d" as string]: `${0.2 + i * 0.1}s` }}><span aria-hidden className="text-lg">{icon}</span><p className="mt-1 font-semibold">{h}</p><p className="text-white/70">{p}</p></div>)}
        </div>
      </div>
    </section>
  );
}
