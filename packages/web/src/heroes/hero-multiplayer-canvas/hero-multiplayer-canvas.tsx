"use client";
import { cn } from "@kinetik/core";

const FONT = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500&display=swap";
const css = `
.k-hmc{font-family:"Inter Tight",ui-sans-serif,system-ui,sans-serif}
.k-hmc .cur{animation:k-hmc-path var(--s) ease-in-out infinite alternate;animation-delay:var(--d)}
@keyframes k-hmc-path{0%{transform:translate(0,0)}33%{transform:translate(var(--x1),var(--y1))}66%{transform:translate(var(--x2),var(--y2))}100%{transform:translate(var(--x3),var(--y3))}}
.k-hmc .site{animation:k-hmc-site 1s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d)}
@keyframes k-hmc-site{from{opacity:0;transform:translateX(var(--from))}}
.k-hmc .ring{background:linear-gradient(90deg,#ff5a36,#ff3d8b,#8b5cf6,#4f46e5,#ff5a36);background-size:300% 100%;animation:k-hmc-ring 6s linear infinite}
@keyframes k-hmc-ring{to{background-position:300% 0}}
@media (prefers-reduced-motion:reduce){.k-hmc *{animation:none!important}}
[data-reduce-motion] .k-hmc *{animation:none!important}`;

const cursors = [
  { name: "Mario", c: "#3b82f6", l: "74%", t: "18%", s: "7s", d: "0s", x1: "-60px", y1: "30px", x2: "-120px", y2: "10px", x3: "-40px", y3: "50px" },
  { name: "Jessica", c: "#facc15", l: "16.5%", t: "45%", s: "8s", d: "-2s", x1: "60px", y1: "-20px", x2: "120px", y2: "30px", x3: "40px", y3: "60px" },
];
const left = [
  { t: "9%", h: "18%", w: "16%", bg: "linear-gradient(135deg,#f9c6d8,#f2a3c0)", label: "OLOGY, MYSTICISM, LESS ABILITIES" },
  { t: "31%", h: "19%", w: "12.5%", bg: "#fff", label: "accelerate e adoption new ideas" },
  { t: "52%", h: "18%", w: "16%", bg: "#111", label: "END TO END, CREATIVE MARKETING AGENCY" },
];
const right = [
  { t: "10%", h: "17%", w: "16%", bg: "linear-gradient(135deg,#dbeafe,#93c5fd)", label: "The world is yours." },
  { t: "31%", h: "18%", w: "12.5%", bg: "linear-gradient(135deg,#fef3c7,#c4b5fd)", label: "Help grow the business" },
  { t: "52%", h: "18%", w: "16%", bg: "#fff", label: "Drive smarter business decisions through AI" },
];

/** AI site-builder hero on a design canvas: product nav, a violet selection frame with handles, site thumbnails bleeding off both edges, wandering multiplayer cursors, a light display headline and a rainbow-ringed prompt bar. */
export function HeroMultiplayerCanvas({ title = "Websites designed & built faster with AI", subtitle = "Use AI as your design ally, not as a replacement. Effortlessly generate sitemaps and wireframes for marketing websites in minutes.", className }: { title?: string; subtitle?: string; className?: string }) {
  const frame = "border-[#6d5dfc]";
  return (
    <section className={cn("k-hmc relative flex flex-col overflow-hidden bg-[#ebeae6] text-[#151515]", className)}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hmc" precedence="kinetik">{css}</style>
      <nav className="relative z-10 flex items-center justify-between px-[2.6%] py-4 text-[13px]"><b className="flex items-center gap-2 text-[17px] font-medium"><span aria-hidden className="grid size-6 place-items-center rounded-md bg-black text-[10px] text-white">◈</span>Relay</b><span className="hidden gap-7 lg:flex"><a href="#">Products ⌄</a><a href="#">Community ⌄</a><a href="#">Pricing</a><a href="#">Learn</a><a href="#">Contact Sales</a></span><span className="flex gap-2"><a href="#" className="rounded-md bg-black px-4 py-2 text-white">Start for free</a><a href="#" className="rounded-md bg-[#6d5dfc] px-4 py-2 text-white">Launch →</a></span></nav>
      <div className="relative h-[62%] min-h-80">
        <div aria-hidden className={cn("absolute inset-y-0 left-[1.6%] border-l", frame)} /><div aria-hidden className={cn("absolute inset-y-0 right-[1.4%] border-r", frame)} /><div aria-hidden className={cn("absolute inset-x-[1.6%] bottom-0 border-b", frame)} />
        {["left-[1.6%]", "right-[1.4%]"].map((p) => <span key={p} aria-hidden className={cn("absolute bottom-0 size-2 translate-y-1/2 border bg-white", frame, p, p.startsWith("left") ? "-translate-x-1/2" : "translate-x-1/2")} />)}
        {[...left.map((s) => ({ ...s, side: "left" as const })), ...right.map((s) => ({ ...s, side: "right" as const }))].map((s, i) => (
          <div key={i} aria-hidden className="site absolute overflow-hidden max-lg:hidden rounded-sm border border-black/10 p-2 text-[clamp(.5rem,1vw,.95rem)] leading-tight font-semibold shadow-md" style={{ [s.side]: 0, top: s.t, height: s.h, width: s.w, background: s.bg, color: s.bg === "#111" ? "#fff" : "#111", ["--d" as string]: `${0.1 + i * 0.06}s`, ["--from" as string]: s.side === "left" ? "-40px" : "40px" }}>{s.label}</div>
        ))}
        {cursors.map((c) => (
          <div key={c.name} aria-hidden className="cur absolute z-10" style={{ left: c.l, top: c.t, ["--s" as string]: c.s, ["--d" as string]: c.d, ["--x1" as string]: c.x1, ["--y1" as string]: c.y1, ["--x2" as string]: c.x2, ["--y2" as string]: c.y2, ["--x3" as string]: c.x3, ["--y3" as string]: c.y3 }}>
            <svg width="14" height="16" viewBox="0 0 14 16"><path d="M1 1 L13 7 L7 8.5 L4.5 14 Z" fill={c.c} stroke="#fff" /></svg>
            <span className="ml-3 rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: c.c, color: c.c === "#facc15" ? "#000" : "#fff" }}>{c.name}</span>
          </div>
        ))}
        <div className="relative mx-auto max-w-[54rem] pt-[4%] text-center">
          <p className="mx-auto flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-[11px]"><span className="text-[#ff5a36]">400k+</span> Designers & Devs build with Relay <span aria-hidden className="flex -space-x-1">{["#f9a8d4", "#93c5fd", "#86efac"].map((c) => <i key={c} className="block size-3.5 rounded-full border border-white" style={{ background: c }} />)}</span></p>
          <h1 className="mt-5 text-[clamp(2.4rem,6vw,5.8rem)] leading-[1.04] font-normal tracking-[-.035em]">{title}</h1>
          <p className="mx-auto mt-5 max-w-[36rem] text-[clamp(.85rem,1.2vw,1.15rem)] text-zinc-700">{subtitle}</p>
        </div>
        <div className="absolute bottom-[-12px] left-[2.5%] flex gap-2 text-[11px]"><span className="rounded-md border border-[#c9c4ff] bg-[#ecebff] px-2 py-1 text-[#6d5dfc]">✦ Shuffle</span><span className="rounded-md border border-black/10 bg-white px-2 py-1">▤ 1,400+ Components</span></div>
      </div>
      <form className="ring relative mx-auto mt-[2.6%] w-[42%] min-w-72 rounded-lg p-[3px]" onSubmit={(e) => e.preventDefault()}>
        <div className="flex items-center gap-2 rounded-md bg-white p-1.5">
          <label htmlFor="k-hmc-in" className="sr-only">Describe a company</label>
          <input id="k-hmc-in" placeholder="Describe a company in a sentence or two..." className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" />
          <button className="rounded-md bg-[#4f46e5] px-4 py-2 text-[13px] text-white">✦ Generate</button>
        </div>
      </form>
      <div className="relative mx-auto flex w-[42%] min-w-72 flex-1"><span aria-hidden className="absolute top-0 left-1/2 h-full w-px bg-[#ff3d3d]" /><p className="ml-auto pt-2 text-[11px] text-zinc-600">Take it for a spin with an <a href="#" className="font-semibold underline">example</a></p></div>
    </section>
  );
}
