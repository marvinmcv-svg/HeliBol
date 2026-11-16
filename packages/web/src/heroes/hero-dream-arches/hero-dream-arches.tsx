"use client";
import { cn } from "@kinetik/core";

const css = `
.k-hda .ripple{animation:k-hda-ripple 5s ease-in-out infinite;animation-delay:var(--d)}
@keyframes k-hda-ripple{50%{transform:scaleX(1.25) translateX(4%);opacity:.25}}
.k-hda .pearl{animation:k-hda-float 6s ease-in-out infinite}
@keyframes k-hda-float{50%{transform:translateY(-12px)}}
.k-hda .cloud{animation:k-hda-cloud 26s linear infinite}
@keyframes k-hda-cloud{to{transform:translateX(60%)}}
.k-hda .in{animation:k-hda-in 1.6s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hda-in{from{opacity:0;filter:blur(14px);transform:translateY(10px)}}
@media (prefers-reduced-motion:reduce){.k-hda *{animation:none!important}}
[data-reduce-motion] .k-hda *{animation:none!important}`;

/** Studio hero: a surreal pastel room — arched windows onto drifting clouds, a floating pearl and rippling water — under a serif/sans headline. */
export function HeroDreamArches({ kicker = "A brand, digital & motion studio", serif = "Creating the", sans = "unexpected", className }: { kicker?: string; serif?: string; sans?: string; className?: string }) {
  const arch = "absolute bottom-[30%] overflow-hidden rounded-t-full bg-gradient-to-b from-[#a8c6ff] to-[#f3d2e4]";
  return (
    <section className={cn("k-hda relative isolate grid min-h-[460px] place-items-center overflow-hidden bg-[#e8c3b9] text-[#2a2022]", className)}>
      <style href="k-hda" precedence="kinetik">{css}</style>
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#efd0c6] via-[#e2b8ae] to-[#c99d97]" />
        {[{ l: "4%", w: "13%", h: "52%" }, { l: "20%", w: "11%", h: "44%" }, { l: "70%", w: "9%", h: "40%" }].map((a, i) => (
          <div key={i} className={arch} style={{ left: a.l, width: a.w, height: a.h }}><span className="cloud absolute top-[30%] -left-1/2 h-4 w-3/4 rounded-full bg-white/80 blur-sm" /></div>
        ))}
        <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-b from-[#b9a2c4] to-[#d8c2d6]">
          {[10, 30, 52, 74].map((t, i) => <span key={t} className="ripple absolute h-px w-1/3 bg-white/60" style={{ top: `${t}%`, left: `${(i * 23) % 60}%`, ["--d" as string]: `${-i * 1.2}s` }} />)}
        </div>
        <div className="pearl absolute top-[44%] right-[30%] size-14 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#f2e6ff_35%,#c7b5e6_70%,#a99bd0)] shadow-[0_20px_40px_-10px_#7c5c8c]" />
        <div className="absolute right-[6%] bottom-[22%] h-[12%] w-[18%] rounded-[50%] bg-gradient-to-b from-[#d9b8a3] to-[#a98a7c]" />
      </div>
      <div className="text-center">
        <p className="in text-[10px] tracking-[.2em] uppercase">{kicker}</p>
        <h1 className="mt-2 leading-[.9]">
          <span className="in block font-serif text-5xl italic sm:text-6xl" style={{ ["--d" as string]: ".15s" }}>{serif}</span>
          <span className="in block text-5xl font-medium tracking-tight sm:text-7xl" style={{ ["--d" as string]: ".35s" }}>{sans}</span>
        </h1>
        <a href="#" className="in mt-6 inline-block rounded-full bg-white px-4 py-1.5 text-xs shadow transition-transform hover:scale-105" style={{ ["--d" as string]: ".6s" }}>View our work ↘</a>
      </div>
    </section>
  );
}
