"use client";
import { cn } from "@kinetik/core";

const css = `
.k-hvt{--accent:#ff4d1a}
.k-hvt .streak{position:absolute;height:var(--h);top:var(--t);left:-60%;width:60%;border-radius:999px;background:linear-gradient(90deg,transparent,var(--c),transparent);filter:blur(var(--b));animation:k-hvt-streak var(--s) linear infinite;animation-delay:var(--d)}
@keyframes k-hvt-streak{to{transform:translateX(280%)}}
.k-hvt .line{display:block;overflow:hidden}
.k-hvt .line>span{display:block;animation:k-hvt-up .9s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d)}
@keyframes k-hvt-up{from{transform:translateY(105%)}}
.k-hvt .fade{animation:k-hvt-fade .8s ease-out both;animation-delay:var(--d)}
@keyframes k-hvt-fade{from{opacity:0;transform:translateY(12px)}}
.k-hvt .logos{animation:k-hvt-marquee 22s linear infinite}
@keyframes k-hvt-marquee{to{transform:translateX(-50%)}}
@media (prefers-reduced-motion:reduce){.k-hvt *{animation:none!important}}
[data-reduce-motion] .k-hvt *{animation:none!important}`;

const streaks = [
  { t: "18%", h: "38px", c: "#3f6212", b: "18px", s: "2.6s", d: "0s" },
  { t: "34%", h: "14px", c: "#d9f99d", b: "8px", s: "1.7s", d: "-.6s" },
  { t: "52%", h: "60px", c: "#57534e", b: "22px", s: "3.2s", d: "-1.4s" },
  { t: "66%", h: "10px", c: "#fafaf9", b: "6px", s: "1.3s", d: "-.2s" },
  { t: "78%", h: "44px", c: "#365314", b: "20px", s: "2.2s", d: "-1s" },
];

/** Sports/performance hero: speed-blur streaks behind giant masked headline lines, a hard-edged CTA and a logo rail. */
export function HeroVelocityType({ lines = ["Unlock", "next level", "performance"], logos = ["NORTHSIDE FC", "VOLT", "TENNIS CLUB", "ARCTIC", "HALFTIME", "PRO LEAGUE"], className }: { lines?: string[]; logos?: string[]; className?: string }) {
  return (
    <section className={cn("k-hvt relative isolate flex flex-col overflow-hidden bg-[#1c1917] text-white", className)}>
      <style href="k-hvt" precedence="kinetik">{css}</style>
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        {streaks.map((s, i) => <span key={i} className="streak" style={{ ["--t" as string]: s.t, ["--h" as string]: s.h, ["--c" as string]: s.c, ["--b" as string]: s.b, ["--s" as string]: s.s, ["--d" as string]: s.d }} />)}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1c1917] via-[#1c1917]/70 to-transparent" />
      </div>
      <div className="flex flex-1 flex-wrap items-end justify-between gap-8 px-6 pt-14 pb-8 sm:px-10">
        <h1 className="text-[clamp(2.6rem,9vw,6.5rem)] leading-[.86] font-bold tracking-[-.04em] uppercase">
          {lines.map((l, i) => <span key={l} className="line"><span style={{ ["--d" as string]: `${0.08 * i}s` }}>{l}</span></span>)}
        </h1>
        <div className="fade max-w-56 pb-2" style={{ ["--d" as string]: ".45s" }}>
          <p className="text-xs leading-relaxed text-white/70">Elite diagnostics, personalised training and advanced therapy — whether you go pro or just get started.</p>
          <a href="#" className="mt-5 inline-flex text-[11px] font-semibold tracking-widest uppercase">
            <span className="bg-[var(--accent)] px-4 py-3">Unlock your potential</span>
            <span className="ml-px grid w-10 place-items-center bg-[var(--accent)] transition-transform hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
      <div className="overflow-hidden border-t border-black/10 bg-[#f5f5f4] py-4 text-zinc-900">
        <div className="logos flex w-max gap-14 pr-14 text-sm font-black tracking-tight">
          {[...logos, ...logos].map((l, i) => <span key={i} aria-hidden={i >= logos.length}>{l}</span>)}
        </div>
      </div>
    </section>
  );
}
