"use client";
import { cn } from "@kinetik/core";

const css = `
.k-hss .ink{stroke-dasharray:var(--l);stroke-dashoffset:var(--l);animation:k-hss-ink var(--t,.6s) cubic-bezier(.65,0,.35,1) forwards;animation-delay:var(--d)}
@keyframes k-hss-ink{to{stroke-dashoffset:0}}
.k-hss .note{animation:k-hss-note .4s ease-out both;animation-delay:var(--d)}
@keyframes k-hss-note{from{opacity:0;transform:rotate(-8deg) scale(.7)}}
.k-hss .band{animation:k-hss-band 16s linear infinite}
@keyframes k-hss-band{to{transform:translateX(-50%)}}
.k-hss .bg{animation:k-hss-zoom 20s ease-in-out infinite alternate}
@keyframes k-hss-zoom{to{transform:scale(1.08)}}
@media (prefers-reduced-motion:reduce){.k-hss *{animation:none!important;stroke-dashoffset:0!important}}
[data-reduce-motion] .k-hss *{animation:none!important;stroke-dashoffset:0!important}`;

/** Studio hero: heavy uppercase statement over a cinematic still, where a hand-drawn red strike edits the last word and scribbled notes pop in. */
export function HeroScribbleStrike({ lead = "Where fresh ideas meet flawless execution. See the work that sets us", struck = "apart", note = "above", image, studio = "Freshcut", className }: { lead?: string; struck?: string; note?: string; image?: string; studio?: string; className?: string }) {
  return (
    <section className={cn("k-hss relative isolate flex flex-col overflow-hidden bg-zinc-900 text-[#f4ecdf]", className)}>
      <style href="k-hss" precedence="kinetik">{css}</style>
      <div aria-hidden className="bg absolute inset-0 -z-10" style={{ background: image ? `center/cover url(${image})` : "radial-gradient(ellipse at 50% 80%,#7f1d1d,#1c1917 60%)" }} />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
      <div className="flex-1 px-6 pt-12 text-center">
        <h1 className="mx-auto max-w-3xl text-[clamp(1.8rem,5vw,3.4rem)] leading-[1.02] font-black tracking-tight uppercase">
          {lead}{" "}
          <span className="relative inline-block">
            <del className="no-underline">{struck}</del>.
            <svg aria-hidden viewBox="0 0 200 40" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-[-6%] top-[30%] h-[45%] w-[112%]">
              <path className="ink" style={{ ["--l" as string]: 260, ["--d" as string]: ".8s" }} d="M4 26 C40 18 80 24 110 16 S170 22 196 12" fill="none" stroke="#ef2b2b" strokeWidth="6" strokeLinecap="round" />
            </svg>
            <span className="note absolute -right-2 -bottom-6 font-serif text-sm font-normal normal-case italic" style={{ ["--d" as string]: "1.3s" }}><ins className="no-underline">{note}</ins></span>
          </span>
        </h1>
        <a href="#" className="relative mt-16 inline-block px-4 py-1 font-serif text-sm italic">
          explore all work
          <svg aria-hidden viewBox="0 0 160 40" className="absolute inset-0 size-full overflow-visible"><path className="ink" style={{ ["--l" as string]: 420, ["--d" as string]: "1.5s", ["--t" as string]: "1s" }} d="M150 12 C120 -2 30 0 10 14 S40 40 90 36 S160 28 140 8" fill="none" stroke="#ef2b2b" strokeWidth="2" /></svg>
        </a>
      </div>
      <div aria-hidden className="mt-10 overflow-hidden bg-[#ef2b2b] text-black">
        <div className="band flex w-max text-[5rem] leading-[.8] font-black tracking-tighter whitespace-nowrap uppercase">{Array.from({ length: 6 }, (_, i) => <span key={i} className="px-6">{studio}</span>)}</div>
      </div>
    </section>
  );
}
