"use client";
import { cn } from "@kinetik/core";

const FONT = "https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400&display=swap";
const css = `
.k-hwd .ch{display:inline-block;animation:k-hwd-drop .9s cubic-bezier(.34,1.56,.64,1) both;animation-delay:calc(var(--i)*60ms)}
@keyframes k-hwd-drop{from{opacity:0;transform:translateY(-50%) scaleY(1.3)}}
.k-hwd .panel{animation:k-hwd-panel 1.1s cubic-bezier(.16,1,.3,1) .45s both}
@keyframes k-hwd-panel{from{opacity:0;transform:translateY(70px)}}
.k-hwd .shine{background:linear-gradient(115deg,transparent 30%,#ffffff22 45%,transparent 60%) 0 0/250% 100%;animation:k-hwd-shine 6s ease-in-out infinite}
@keyframes k-hwd-shine{to{background-position:-150% 0}}
.k-hwd .line{stroke-dasharray:900;stroke-dashoffset:900;animation:k-hwd-line 2.4s ease-out 1.2s forwards}
@keyframes k-hwd-line{to{stroke-dashoffset:0}}
.k-hwd .play{animation:k-hwd-ping 2.4s ease-out infinite 2s}
@keyframes k-hwd-ping{0%{box-shadow:0 0 0 0 #fff8}100%{box-shadow:0 0 0 22px #fff0}}
@media (prefers-reduced-motion:reduce){.k-hwd *{animation:none!important;stroke-dashoffset:0!important}}
[data-reduce-motion] .k-hwd *{animation:none!important;stroke-dashoffset:0!important}`;

const side = ["Home", "Orders", "Products", "Customers", "Marketing", "Discounts", "Content", "Markets", "Finance", "Analytics"];

/** Product-launch hero: a giant condensed wordmark drops in letter by letter, then a violet stage rises with a condensed tagline and a full store-admin mock whose chart draws itself. */
export function HeroWordmarkDashboard({ word = "COPILOT", tagline = "A smarter, more powerful Copilot", className }: { word?: string; tagline?: string; className?: string }) {
  return (
    <section className={cn("k-hwd flex flex-col overflow-hidden bg-[#140b26] pt-[3.5%] text-white", className)}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hwd" precedence="kinetik">{css}</style>
      <h1 aria-label={word} className="text-center text-[clamp(4rem,12.5vw,12rem)] leading-[.9] tracking-[-.02em] [transform:scaleX(.72)]" style={{ fontFamily: "Anton,Impact,sans-serif" }}>
        {[...word].map((c, i) => <span key={i} aria-hidden className="ch" style={{ ["--i" as string]: i }}>{c}</span>)}
      </h1>
      <div className="panel relative mx-[0.6%] mt-[3.5%] flex-1 overflow-hidden rounded-t-sm bg-[linear-gradient(180deg,#8f5cff,#7647f5_40%,#6a3ff0)] px-[7%] pt-[3%] text-center">
        <div aria-hidden className="shine absolute inset-0" />
        <p className="relative text-[clamp(1.6rem,3.8vw,3.5rem)] leading-none tracking-[-.03em] [transform:scaleX(.82)]" style={{ fontFamily: "Oswald,sans-serif", fontWeight: 300 }}>{tagline}</p>
        <p className="relative mx-auto mt-3 max-w-xl text-[clamp(.75rem,1.1vw,1rem)] text-white/80">Copilot now uses multi-step reasoning and goes deeper to provide data-driven strategies based on an analysis of your business.</p>
        <a href="#" className="relative mt-4 inline-block rounded-full bg-white/20 px-3 py-1 text-[12px] backdrop-blur">Learn more ↗</a>
        <div aria-hidden className="relative mx-auto mt-[4.5%] w-[85%] max-w-none overflow-hidden rounded-t-xl bg-[#f1f1f1] text-left text-[11px] text-zinc-800 shadow-2xl">
          <div className="flex items-center justify-between bg-[#1a1a1a] px-3 py-2 text-white"><span className="font-bold">◧ storefront</span><span className="w-1/3 rounded-md bg-[#303030] px-3 py-1 text-white/50">⌕ Search</span><span className="flex items-center gap-3"><span>◫</span><span>🔔</span><span className="rounded bg-[#ffd76a] px-1 text-black">VI</span> Villa</span></div>
          <div className="flex">
            <ul className="w-44 shrink-0 space-y-1 p-3">{side.map((s, i) => <li key={s} className={cn("rounded-md px-2 py-0.5", i === 0 && "bg-white font-semibold")}>▪ {s}{i === 1 && <span className="float-right rounded bg-zinc-200 px-1">15</span>}</li>)}<li className="pt-3 text-zinc-500">Sales channels</li><li className="px-2">▪ Online store</li><li className="px-2">▪ Point of Sale</li></ul>
            <div className="flex-1 p-4">
              <div className="flex gap-2"><span className="rounded-md border border-zinc-300 bg-white px-2 py-1">▣ Today</span><span className="rounded-md border border-zinc-300 bg-white px-2 py-1">All channels ⌄</span><span className="rounded-md border border-zinc-300 bg-white px-2 py-1"><span className="text-emerald-600">●</span> 124 live visitors</span><span className="ml-auto rounded-md border border-zinc-300 bg-white px-2 py-1">Next payout: $23,456.24</span></div>
              <div className="relative mt-3 rounded-xl bg-white p-3 shadow-sm">
                <div className="grid grid-cols-4 gap-2">{[["Online store sessions", "195,567", "↑ 1%"], ["Total sales", "$189,657.98", "↑ 2%"], ["Total orders", "2,978", "↑ 10%"], ["Conversion rate", "3.65%", "↑ 5%"]].map(([k, v, d], i) => <div key={k} className={cn("rounded-lg p-2", i === 0 && "bg-zinc-100")}><p className="text-zinc-500 underline decoration-dotted">{k}</p><p className="text-sm font-semibold">{v} <span className="text-[10px] font-normal text-emerald-600">{d}</span></p></div>)}</div>
                <div className="mt-1 flex text-[9px] text-zinc-400"><span className="w-6">12K</span></div><svg viewBox="0 0 600 120" className="h-40 w-full"><path d="M0 70 C 40 20, 60 110, 100 70 S 160 10, 200 60 S 260 120, 300 60 S 360 0, 400 50 S 460 110, 500 50 S 560 20, 600 60" fill="none" stroke="#d4d4d8" strokeWidth="2" /><path className="line" d="M0 50 C 30 10, 70 90, 110 40 S 170 100, 210 30 S 280 110, 320 60 S 380 20, 420 80 S 480 10, 520 50 S 570 90, 600 40" fill="none" stroke="#4fb6e8" strokeWidth="2.5" /></svg>
                <span className="play absolute top-1/2 left-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-zinc-700/85 text-xl text-white">▶</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">{["▣ 5 orders to fulfill", "⇄ 50+ payments to capture", "▤ 8 return requests"].map((t) => <span key={t} className="rounded-md border border-zinc-300 bg-white px-2 py-1">{t}</span>)}</div>
              <p className="mt-3 text-center text-zinc-500">◎ All caught up</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
