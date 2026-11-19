"use client";
import { cn } from "@kinetik/core";

const FONT = "https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500&family=Inter:wght@400;600&display=swap";
const css = `
.k-hls{font-family:Inter,ui-sans-serif,system-ui,sans-serif}
.k-hls .ch{display:inline-block;white-space:pre;animation:k-hls-ch .8s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(var(--i)*28ms)}
@keyframes k-hls-ch{from{opacity:0;transform:translateY(.25em);filter:blur(4px)}}
.k-hls .award{animation:k-hls-aw .6s ease-out both;animation-delay:calc(.8s + var(--i)*70ms)}
@keyframes k-hls-aw{from{opacity:0;transform:scale(.8)}}
.k-hls .slab{animation:k-hls-slab 1.2s cubic-bezier(.16,1,.3,1) 1.2s both}
@keyframes k-hls-slab{from{transform:translateY(100%)}}
@media (prefers-reduced-motion:reduce){.k-hls *{animation:none!important}}
[data-reduce-motion] .k-hls *{animation:none!important}`;

const Laurel = ({ flip }: { flip?: boolean }) => <svg aria-hidden viewBox="0 0 6 12" className={cn("inline h-[1.1em] w-[.6em] align-[-.2em]", flip && "-scale-x-100")}><path d="M5 1 C2 3 2 9 5 11" fill="none" stroke="currentColor" strokeWidth=".7" />{[2.5, 5, 7.5].map((y) => <ellipse key={y} cx="3" cy={y} rx="1.4" ry=".7" transform={`rotate(-30 3 ${y})`} fill="currentColor" />)}</svg>;

/** Quiet agency hero: tiny letter-spaced wordmark, one serif line revealing per character, laurel-wrapped awards popping in, and a neon slab rising from the fold. */
export function HeroLaurelSerif({ title = "Rewrite your worth.", awards = ["AdAge 2019", "AdAge 2020", "AdAge 2021", "D&AD 2021", "AdAge 2023", "AdAge 2024", "AdAge 2025"], className }: { title?: string; awards?: string[]; className?: string }) {
  return (
    <section className={cn("k-hls relative flex min-h-[460px] flex-col overflow-hidden bg-[#f6f6f4] text-[#1b1414]", className)}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hls" precedence="kinetik">{css}</style>
      <nav className="flex items-center justify-between px-[8.8%] pt-[1.8%] text-[clamp(.7rem,1.05vw,1rem)] font-semibold tracking-[.12em]"><span>HOLLIS</span><span aria-hidden className="text-lg font-normal">=</span></nav>
      <div className="flex flex-1 flex-col items-center px-6 text-center">
        <h1 aria-label={title} className="mt-[20%] text-[clamp(2.2rem,4.6vw,4.3rem)] tracking-[-.01em]" style={{ fontFamily: '"EB Garamond",serif' }}>{[...title].map((c, i) => <span key={i} aria-hidden className="ch" style={{ ["--i" as string]: i }}>{c}</span>)}</h1>
        <p className="mt-[9%] text-[clamp(.45rem,.65vw,.65rem)] text-zinc-500">7x Agency of the Year</p>
        <ul className="mt-3 flex max-w-[30rem] flex-wrap justify-center gap-x-4 gap-y-2 text-[clamp(.45rem,.68vw,.68rem)] text-zinc-700">
          {awards.map((a, i) => <li key={a} className="award flex items-center gap-1.5" style={{ ["--i" as string]: i }}><Laurel />{a}<Laurel flip /></li>)}
        </ul>
      </div>
      <div aria-hidden className="slab mx-[17.2%] mt-[5%] h-[10%] min-h-12 rounded-t-lg bg-[#00e83a]" />
    </section>
  );
}
