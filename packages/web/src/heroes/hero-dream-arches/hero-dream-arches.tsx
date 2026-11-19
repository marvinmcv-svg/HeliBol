"use client";
import { cn } from "@kinetik/core";

const FONT = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Inter+Tight:wght@400;500&display=swap";
const css = `
.k-hda{font-family:"Inter Tight",ui-sans-serif,system-ui,sans-serif}
.k-hda .ripple{animation:k-hda-ripple 5s ease-in-out infinite;animation-delay:var(--d)}
@keyframes k-hda-ripple{50%{transform:scaleX(1.25) translateX(4%);opacity:.2}}
.k-hda .pearl{animation:k-hda-float 6s ease-in-out infinite}
@keyframes k-hda-float{50%{transform:translateY(-12px)}}
.k-hda .cloud{animation:k-hda-cloud 26s linear infinite}
@keyframes k-hda-cloud{to{transform:translateX(70%)}}
.k-hda .in{animation:k-hda-in 1.6s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hda-in{from{opacity:0;filter:blur(14px);transform:translateY(10px)}}
@media (prefers-reduced-motion:reduce){.k-hda *{animation:none!important}}
[data-reduce-motion] .k-hda *{animation:none!important}`;

/** Studio hero: a surreal pastel room — a tall arch onto lavender hills, a doorway to the sky, a stair rising out of still water, rocks and a floating pearl — under an italic-serif + sans headline. */
export function HeroDreamArches({ studio = "unseen studio", kicker = "A brand, digital & motion studio", serif = "Creating the", sans = "unexpected", className }: { studio?: string; kicker?: string; serif?: string; sans?: string; className?: string }) {
  return (
    <section className={cn("k-hda relative isolate flex min-h-[460px] flex-col justify-between overflow-hidden bg-[#e7c6bd] p-[1.8%] text-[#2a2022]", className)}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hda" precedence="kinetik">{css}</style>
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(100deg,#d9b2ac_0%,#ecd0c6_35%,#e8c6bc_60%,#dcb3aa_100%)]" />
        <div className="absolute top-[24%] left-[3%] h-[52%] w-[13%] overflow-hidden rounded-t-full bg-gradient-to-b from-[#b9c9f2] via-[#e6d2ee] to-[#c6a3d6] shadow-[inset_-14px_0_20px_#c9958f]"><div className="absolute bottom-0 h-1/3 w-[140%] rounded-t-[50%] bg-[#b88fd0]" /></div>
        <div className="absolute top-[0%] left-[-4%] h-[80%] w-[5%] rounded-tr-full bg-[#d7a8a1]" />
        <div className="absolute top-[26%] left-[51%] h-[10%] w-[4.5%] bg-gradient-to-b from-[#9fc2f5] to-[#cfd9f5]" />
        <div className="absolute top-[4%] right-[16%] h-[42%] w-[12%] overflow-hidden bg-gradient-to-b from-[#76a8f0] to-[#c3d6f7] shadow-[inset_10px_0_0_#c48e86]"><span className="cloud absolute top-[60%] -left-1/2 h-4 w-3/4 rounded-full bg-white/80 blur-sm" /></div>
        {Array.from({ length: 6 }, (_, i) => <div key={i} className="absolute bg-gradient-to-b from-[#f1dad3] to-[#d9b4ac]" style={{ left: `${27 + i * 1.6}%`, right: `${46 - i * 1.2}%`, top: `${60 - i * 5}%`, height: "5.5%" }} />)}
        <div className="absolute inset-x-0 bottom-0 h-[24%] bg-gradient-to-b from-[#bfa4c6] to-[#e2cbd9]">
          {[10, 30, 52, 74].map((t, i) => <span key={t} className="ripple absolute h-px w-1/3 bg-white/60" style={{ top: `${t}%`, left: `${(i * 23) % 60}%`, ["--d" as string]: `${-i * 1.2}s` }} />)}
        </div>
        <div className="pearl absolute top-[46%] left-[57%] size-[3.4%] min-w-6 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#f2e6ff_35%,#c7b5e6_70%,#a99bd0)] opacity-80" />
        <div className="absolute right-[18%] bottom-[18%] h-[14%] w-[13%] rounded-[50%_50%_40%_40%] bg-[radial-gradient(ellipse_at_40%_30%,#e5c4ae,#a98572)]" />
        <div className="absolute right-[-3%] bottom-[10%] h-[16%] w-[14%] rounded-[50%] bg-[radial-gradient(ellipse_at_40%_30%,#d9b6a2,#9c7a68)]" />
      </div>
      <header className="flex items-start justify-between"><span className="text-[clamp(1rem,1.6vw,1.5rem)] tracking-tight">{studio}<sup className="text-[.5em]">®</sup></span><nav className="flex items-center gap-4 text-[13px]"><a href="#" className="relative">Index<span aria-hidden className="absolute top-full left-1/2 mt-1 h-5 w-4 -translate-x-1/2 rounded-[50%] border border-current" /></a><a href="#">Projects</a><a href="#">Contact</a><span className="grid size-8 place-items-center rounded-full bg-white text-xs">••</span></nav></header>
      <div className="mr-auto ml-[30%] text-center">
        <p className="in text-[clamp(.55rem,.9vw,.8rem)] tracking-[.02em] uppercase">{kicker}</p>
        <h1 className="mt-1 leading-[.86]">
          <span className="in block text-[clamp(2.8rem,6.6vw,6.2rem)] tracking-[-.04em]" style={{ fontFamily: '"Instrument Serif",serif', fontStyle: "italic", ["--d" as string]: ".15s" }}>{serif}</span>
          <span className="in block text-[clamp(2.8rem,7vw,6.6rem)] font-medium tracking-[-.05em]" style={{ ["--d" as string]: ".35s" }}>{sans}</span>
        </h1>
        <a href="#" className="in mt-[4%] inline-block rounded-full bg-white px-4 py-1.5 text-[12px] shadow transition-transform hover:scale-105" style={{ ["--d" as string]: ".6s" }}>View our work ↘</a>
      </div>
      <footer className="flex items-center justify-between text-[12px]"><span className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-full bg-white/80">▥</span><span className="rounded-full border border-white px-4 py-1.5 text-white">Our 2025 Wrapped</span></span><span className="grid size-8 place-items-center rounded-full bg-white/80">◍</span><span className="text-white">©2026</span></footer>
    </section>
  );
}
