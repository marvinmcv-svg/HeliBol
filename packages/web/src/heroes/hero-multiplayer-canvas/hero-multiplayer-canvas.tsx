"use client";
import { cn } from "@kinetik/core";

const css = `
.k-hmc .cur{animation:k-hmc-path var(--s) ease-in-out infinite alternate;animation-delay:var(--d)}
@keyframes k-hmc-path{0%{transform:translate(0,0)}33%{transform:translate(var(--x1),var(--y1))}66%{transform:translate(var(--x2),var(--y2))}100%{transform:translate(var(--x3),var(--y3))}}
.k-hmc .site{animation:k-hmc-site 1s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d)}
@keyframes k-hmc-site{from{opacity:0;transform:translateX(var(--from))}}
.k-hmc .ring{background:linear-gradient(90deg,#f97316,#ec4899,#8b5cf6,#3b82f6,#f97316);background-size:300% 100%;animation:k-hmc-ring 6s linear infinite}
@keyframes k-hmc-ring{to{background-position:300% 0}}
@media (prefers-reduced-motion:reduce){.k-hmc *{animation:none!important}}
[data-reduce-motion] .k-hmc *{animation:none!important}`;

const cursors = [
  { name: "Mario", c: "#3b82f6", l: "72%", t: "16%", s: "7s", d: "0s", x1: "-60px", y1: "40px", x2: "-120px", y2: "10px", x3: "-40px", y3: "70px" },
  { name: "Jess", c: "#facc15", l: "18%", t: "44%", s: "8s", d: "-2s", x1: "80px", y1: "-30px", x2: "140px", y2: "40px", x3: "40px", y3: "90px" },
];
const sites = [
  { side: "left", t: "8%", bg: "linear-gradient(135deg,#fbcfe8,#f472b6)", d: ".1s" }, { side: "left", t: "36%", bg: "linear-gradient(135deg,#fff,#e5e7eb)", d: ".2s" }, { side: "left", t: "64%", bg: "linear-gradient(135deg,#111,#3f3f46)", d: ".3s" },
  { side: "right", t: "10%", bg: "linear-gradient(135deg,#e0f2fe,#7dd3fc)", d: ".15s" }, { side: "right", t: "38%", bg: "linear-gradient(135deg,#fef3c7,#c4b5fd)", d: ".25s" }, { side: "right", t: "66%", bg: "linear-gradient(135deg,#fff,#fde68a)", d: ".35s" },
];

/** AI site-builder hero on a design canvas: selection frame with handles, website thumbnails at the edges, live multiplayer cursors and a glowing prompt bar. */
export function HeroMultiplayerCanvas({ title = "Websites designed & built faster with AI", subtitle = "Use AI as your design ally, not a replacement. Generate sitemaps and wireframes in minutes.", className }: { title?: string; subtitle?: string; className?: string }) {
  return (
    <section className={cn("k-hmc relative overflow-hidden bg-[#ebeae6] px-6 py-10 text-[#151515]", className)}>
      <style href="k-hmc" precedence="kinetik">{css}</style>
      <div aria-hidden className="pointer-events-none absolute inset-x-[4%] top-4 bottom-24 border border-[#6d5dfc]">
        {["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map((p) => <span key={p} className={cn("absolute size-2 border border-[#6d5dfc] bg-white", p)} />)}
      </div>
      {sites.map((s, i) => <div key={i} aria-hidden className="site absolute h-[22%] w-[17%] rounded-md border border-black/10 shadow-md" style={{ [s.side]: "-4%", top: s.t, background: s.bg, ["--d" as string]: s.d, ["--from" as string]: s.side === "left" ? "-40px" : "40px" }} />)}
      {cursors.map((c) => (
        <div key={c.name} aria-hidden className="cur absolute z-10" style={{ left: c.l, top: c.t, ["--s" as string]: c.s, ["--d" as string]: c.d, ["--x1" as string]: c.x1, ["--y1" as string]: c.y1, ["--x2" as string]: c.x2, ["--y2" as string]: c.y2, ["--x3" as string]: c.x3, ["--y3" as string]: c.y3 }}>
          <svg width="14" height="16" viewBox="0 0 14 16"><path d="M1 1 L13 7 L7 8.5 L4.5 14 Z" fill={c.c} stroke="#fff" /></svg>
          <span className="ml-3 rounded px-1.5 py-0.5 text-[10px] font-medium text-white" style={{ background: c.c, color: c.c === "#facc15" ? "#000" : "#fff" }}>{c.name}</span>
        </div>
      ))}
      <div className="relative mx-auto max-w-xl text-center">
        <p className="mx-auto w-fit rounded-full border border-black/10 bg-white/60 px-3 py-1 text-[11px]">400k+ designers & devs build with us</p>
        <h1 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-zinc-600">{subtitle}</p>
      </div>
      <form className="ring relative mx-auto mt-8 max-w-md rounded-xl p-[2px]" onSubmit={(e) => e.preventDefault()}>
        <div className="flex items-center gap-2 rounded-[10px] bg-white p-1.5">
          <label htmlFor="k-hmc-in" className="sr-only">Describe a company</label>
          <input id="k-hmc-in" placeholder="Describe a company in a sentence or two…" className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" />
          <button className="rounded-lg bg-[#6d5dfc] px-3 py-1.5 text-xs font-medium text-white">✦ Generate</button>
        </div>
      </form>
    </section>
  );
}
