"use client";
import { cn } from "@kinetik/core";

const FONT = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";
const css = `
.k-hvt{font-family:"Inter Tight",ui-sans-serif,system-ui,sans-serif}
.k-hvt .mono{font-family:"JetBrains Mono",ui-monospace,monospace}
.k-hvt .photo{animation:k-hvt-pan 14s ease-in-out infinite alternate}
@keyframes k-hvt-pan{to{transform:scale(1.12) translateX(-3%)}}
.k-hvt .streak{position:absolute;left:-40%;width:45%;border-radius:999px;filter:blur(14px);animation:k-hvt-streak var(--s) linear infinite;animation-delay:var(--d)}
@keyframes k-hvt-streak{to{transform:translateX(330%)}}
.k-hvt .line{display:block;overflow:hidden}
.k-hvt .line>span{display:block;animation:k-hvt-up 1s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d)}
@keyframes k-hvt-up{from{transform:translateY(100%)}}
.k-hvt .logos{animation:k-hvt-marquee 26s linear infinite}
@keyframes k-hvt-marquee{to{transform:translateX(-50%)}}
@media (prefers-reduced-motion:reduce){.k-hvt *{animation:none!important}}
[data-reduce-motion] .k-hvt *{animation:none!important}`;

const logos = ["NORTHSIDE FC", "◎", "TENNIS CLUB", "✦", "HALFTIME", "◈", "ARCTIC", "▲", "PRO LEAGUE", "⬡", "NORTHSIDE FC", "◎"];

/** Sports-performance hero: thin mono nav, a motion-blurred action photo with giant stacked uppercase lines, an orange split CTA, a logo strip and the intro statement below. */
export function HeroVelocityType({ lines = ["Unlock", "next level", "performance"], image, className }: { lines?: string[]; image?: string; className?: string }) {
  return (
    <section className={cn("k-hvt flex flex-col overflow-hidden bg-white text-[#111]", className)}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hvt" precedence="kinetik">{css}</style>
      <nav className="mono flex items-center justify-between px-5 py-2.5 text-[11px] tracking-wide uppercase">
        <span className="font-medium">The Kinet◘c Lab</span>
        <span className="hidden gap-8 lg:flex"><a href="#">Home</a><a href="#">Who we are</a><a href="#">Blog</a><a href="#">Contact</a><a href="#" className="ml-10">Services +</a></span>
        <a href="#" className="text-[#ff4a1c]">Book a consultation ↗</a>
      </nav>
      <div className="relative isolate shrink-0 overflow-hidden bg-[#1e1d1a] text-white">
        <div aria-hidden className="photo absolute inset-0 -z-10" style={{ background: image ? `center/cover url(${image})` : "linear-gradient(100deg,#272622 0%,#3b3a2e 35%,#6f6a4a 55%,#2c2b26 80%)", filter: "blur(3px) saturate(.8)" }} />
        <div aria-hidden className="absolute inset-0 -z-10">
          {[["22%", "70px", "#c8d84a66", "2.8s", "0s"], ["48%", "40px", "#ffffff33", "1.9s", "-.8s"], ["70%", "90px", "#9aa63a55", "3.4s", "-1.6s"]].map(([t, h, c, s, d], i) => <span key={i} className="streak" style={{ top: t, height: h, background: `linear-gradient(90deg,transparent,${c},transparent)`, ["--s" as string]: s, ["--d" as string]: d }} />)}
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-black/30" />
        </div>
        <div className="flex items-end justify-between gap-10 pt-12 pr-12 pb-6">
          <h1 className="-ml-[0.06em] text-[clamp(3.5rem,9.6vw,9rem)] leading-[.84] font-medium tracking-[-.045em] uppercase">
            {lines.map((l, i) => <span key={l} className="line"><span style={{ ["--d" as string]: `${0.1 * i}s` }}>{l}</span></span>)}
          </h1>
          <div className="mb-8 hidden w-[22%] shrink-0 lg:block">
            <p className="text-[13px] leading-snug text-white/80">The Kinetic Lab specializes in elite diagnostics, personalized training, and advanced therapy to help you reach your physical peak — whether you're a professional athlete or just getting started.</p>
            <a href="#" className="mono mt-12 inline-flex text-[11px] tracking-wider uppercase">
              <span className="bg-[#ff4a1c] px-5 py-4">Unlock your potential</span>
              <span className="ml-1 grid w-12 place-items-center bg-[#ff4a1c] transition-transform hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </div>
      <div className="shrink-0 overflow-hidden bg-[#efefef] py-6">
        <div aria-hidden className="logos flex w-max items-center gap-24 pr-24 text-2xl font-semibold tracking-tight text-black">{[...logos, ...logos].map((l, i) => <span key={i}>{l}</span>)}</div>
      </div>
      <div className="relative min-h-40 flex-1 bg-white px-6 pt-[13%] text-center">
        <div aria-hidden className="absolute top-[8%] left-[71.5%] aspect-square w-[10.7%] bg-[radial-gradient(circle_at_60%_55%,#ddd,#222_35%,#050505_70%)]" />
        <div aria-hidden className="absolute bottom-0 left-[3%] h-[14%] w-[17.6%] bg-gradient-to-r from-[#3a4a2e] to-[#6a6a52]" />
        <p className="mono text-[10px] tracking-widest text-zinc-400 uppercase">What is the Kinetic Lab</p>
        <h2 className="mx-auto mt-5 max-w-4xl text-[clamp(2rem,4.4vw,4rem)] leading-[1.02] font-medium tracking-[-.035em]">Helping you move better, recover smarter, and perform at your best</h2>
      </div>
    </section>
  );
}
