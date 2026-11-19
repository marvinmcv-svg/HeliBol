"use client";
import { cn } from "@kinetik/core";

const FONT = "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,800;1,900&family=Caveat:wght@500&family=Cormorant+Garamond:wght@500&display=swap";
const css = `
.k-hss{font-family:Montserrat,ui-sans-serif,system-ui,sans-serif}
.k-hss .hand{font-family:Caveat,cursive}
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

/** Studio hero: black top bar, a cinematic full-bleed still under a heavy cream uppercase statement whose last word gets a hand-drawn red strike and scribbled correction, a circled link and a red name band. */
export function HeroScribbleStrike({ lead = "Where fresh ideas meet flawless execution. See the work that sets us", struck = "apart", note = "above", image, studio = "freshcut", className }: { lead?: string; struck?: string; note?: string; image?: string; studio?: string; className?: string }) {
  return (
    <section className={cn("k-hss relative isolate flex flex-col overflow-hidden bg-[#141414] text-[#f3e7d3]", className)}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hss" precedence="kinetik">{css}</style>
      <header className="flex items-center justify-between bg-[#141414] px-[1.4%] py-3"><span className="text-[22px] font-black tracking-tight text-[#8b8b8b] italic">{studio}</span><a href="#" className="text-[13px] tracking-wide text-[#8b8b8b] uppercase" style={{ fontFamily: '"Cormorant Garamond",serif' }}>+ Menu</a></header>
      <div className="relative flex-1">
        <div aria-hidden className="bg absolute inset-0 -z-10" style={{ background: image ? `center/cover url(${image})` : "linear-gradient(180deg,#3d3833 0%,#6e5a4c 32%,#2b2724 60%,#1a1816 100%)" }} />
        <div aria-hidden className="absolute inset-0 -z-10 bg-black/35" />
        <div className="px-[7.5%] pt-[4%] text-center">
          <h1 className="mx-auto text-[clamp(1.8rem,4.55vw,4.3rem)] leading-[1.03] font-extrabold tracking-[-.02em] uppercase">
            {lead}{" "}
            <span className="relative inline-block">
              <del className="no-underline">{struck}</del>.
              <svg aria-hidden viewBox="0 0 200 40" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-[-4%] top-[42%] h-[30%] w-[108%]">
                <path className="ink" style={{ ["--l" as string]: 230, ["--d" as string]: ".8s" }} d="M3 22 C 50 16, 120 20, 198 14" fill="none" stroke="#e42620" strokeWidth="7" strokeLinecap="round" />
              </svg>
              <span className="note hand absolute right-0 -bottom-[38%] text-[clamp(.9rem,1.6vw,1.6rem)] font-medium normal-case tracking-normal text-[#f3e7d3]" style={{ ["--d" as string]: "1.3s" }}><ins className="no-underline">{note}</ins></span>
            </span>
          </h1>
          <a href="#" className="hand relative mx-auto mt-[9%] block w-fit px-5 py-1 text-[clamp(.8rem,1.1vw,1.05rem)]">
            explore all work
            <svg aria-hidden viewBox="0 0 160 40" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible"><path className="ink" style={{ ["--l" as string]: 420, ["--d" as string]: "1.5s", ["--t" as string]: "1s" }} d="M150 12 C120 -2 30 0 8 16 S40 40 90 36 S162 28 140 8" fill="none" stroke="#e42620" strokeWidth="2" /></svg>
          </a>
        </div>
      </div>
      <div aria-hidden className="h-[4.2%] min-h-6 overflow-hidden bg-[#e42620] text-black">
        <div className="band flex w-max translate-y-[-30%] text-[clamp(5rem,13vw,12rem)] leading-[.8] font-black tracking-[-.04em] whitespace-nowrap italic">{Array.from({ length: 6 }, (_, i) => <span key={i} className="px-[3vw]">{studio}</span>)}</div>
      </div>
    </section>
  );
}
