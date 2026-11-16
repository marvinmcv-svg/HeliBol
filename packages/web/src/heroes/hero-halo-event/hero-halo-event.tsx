"use client";
import { cn } from "@kinetik/core";

const css = `
@property --ha{syntax:"<angle>";initial-value:0deg;inherits:false}
.k-hhe .rim{background:conic-gradient(from var(--ha),#ff9ad5,#ffe08a,#9dffe0,#8ec5ff,#d39bff,#ff9ad5);-webkit-mask:radial-gradient(circle,transparent 64%,#000 66%,#000 67.5%,transparent 70%);mask:radial-gradient(circle,transparent 64%,#000 66%,#000 67.5%,transparent 70%);animation:k-hhe-spin 8s linear infinite}
@keyframes k-hhe-spin{to{--ha:360deg}}
.k-hhe .glass{background:radial-gradient(circle at 50% 55%,#ffffff 0,#f2f8ff 12%,#cfe4ff 30%,#8fbaf0 55%,#8fb5ea99 64%,transparent 69%);animation:k-hhe-breathe 4s ease-in-out infinite}
@keyframes k-hhe-breathe{50%{filter:brightness(1.12)}}
.k-hhe .in{animation:k-hhe-in 1.2s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hhe-in{from{opacity:0;transform:translateY(12px)}}
.k-hhe .grow{animation:k-hhe-grow 1.6s cubic-bezier(.16,1,.3,1) both}
@keyframes k-hhe-grow{from{opacity:0;transform:scale(.6);filter:blur(20px)}}
@media (prefers-reduced-motion:reduce){.k-hhe *{animation:none!important}}
[data-reduce-motion] .k-hhe *{animation:none!important}`;

const nav = ["Store", "Mac", "Pad", "Phone", "Watch", "Vision", "Pods", "TV & Home", "Entertainment", "Accessories", "Support"];

/** Keynote/event hero: slim global nav over a sky-blue field where a glassy orb with an iridescent rotating rim glows above a one-line announcement and a single pill CTA. */
export function HeroHaloEvent({ announce = "Introducing Phone Duo, Phone 18 Pro, Watch Series 12, Watch Ultra 4, and Pods 5.", cta = "Watch the event", className }: { announce?: string; cta?: string; className?: string }) {
  return (
    <section className={cn("k-hhe flex flex-col overflow-hidden bg-white text-white", className)}>
      <style href="k-hhe" precedence="kinetik">{css}</style>
      <nav className="flex items-center justify-center gap-[2.6%] bg-white/90 py-3 text-[11px] text-[#1d1d1f]"><span aria-hidden className="text-sm">◉</span>{nav.map((n) => <a key={n} href="#">{n}</a>)}<span aria-hidden>⌕</span><span aria-hidden>⛉</span></nav>
      <div className="relative flex flex-1 flex-col items-center justify-center bg-[linear-gradient(180deg,#78a7e0_0%,#5d8fd3_55%,#4b7cc3_100%)] px-6 py-[3%] text-center">
        <div aria-hidden className="grow relative aspect-square w-[19%] max-w-72 min-w-36">
          <div className="absolute inset-[-25%] rounded-full bg-[radial-gradient(circle,#ffffff66,transparent_60%)] blur-2xl" />
          <div className="glass absolute inset-0 rounded-full" />
          <div className="rim absolute inset-0 rounded-full opacity-80 blur-[1.5px]" />
          <div className="rim absolute inset-[-12%] rounded-full opacity-40 blur-2xl" />
          <div className="absolute inset-[38%] rounded-full bg-white blur-lg" />
        </div>
        <h1 className="in mt-[1.5%] max-w-[37rem] text-[clamp(1rem,1.6vw,1.5rem)] leading-tight font-semibold" style={{ ["--d" as string]: ".5s" }}>{announce}</h1>
        <a href="#" className="in mt-5 rounded-full bg-white px-5 py-2.5 text-[clamp(.75rem,1.1vw,1rem)] text-[#1d1d1f] transition-transform hover:scale-105" style={{ ["--d" as string]: ".7s" }}>{cta}</a>
      </div>
    </section>
  );
}
