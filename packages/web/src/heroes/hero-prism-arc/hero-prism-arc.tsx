"use client";
import { cn } from "@kinetik/core";

const FONT = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap";
const css = `
.k-hpa{font-family:Inter,ui-sans-serif,system-ui,sans-serif}
@property --pa{syntax:"<angle>";initial-value:0deg;inherits:false}
.k-hpa .prism{background:conic-gradient(from var(--pa) at 52% 60%,#fff3e0,#ffb066,#ff7a3d,#fde68a,#e0f2fe,#93c5fd,#c4b5fd,#fff,#f59e0b,#fff3e0);animation:k-hpa-rot 14s linear infinite}
@keyframes k-hpa-rot{to{--pa:360deg}}
.k-hpa .facet{animation:k-hpa-facet 5s ease-in-out infinite alternate;animation-delay:var(--d)}
@keyframes k-hpa-facet{to{transform:rotate(var(--r)) translateX(12px);opacity:.3}}
.k-hpa .in{animation:k-hpa-in 1s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hpa-in{from{opacity:0;transform:translateY(16px)}}
.k-hpa .rise{animation:k-hpa-rise 1.6s cubic-bezier(.16,1,.3,1) .3s both}
@keyframes k-hpa-rise{from{transform:translateY(30%)}}
@media (prefers-reduced-motion:reduce){.k-hpa *{animation:none!important}}
[data-reduce-motion] .k-hpa *{animation:none!important}`;

/** Creative-AI hero on soft grey: minimal nav, a light two-line headline, copy with bold keywords and a big pill CTA, above a half-dome window of rotating prismatic crystal light. */
export function HeroPrismArc({ title = "Creative Intelligence platform for magical AI products", cta = "Start Building", className }: { title?: string; cta?: string; className?: string }) {
  return (
    <section className={cn("k-hpa relative flex flex-col overflow-hidden bg-[#f0f0f0] text-center text-[#1a1a1a]", className)}>
      <style href="k-hpa" precedence="kinetik">{css}</style>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <nav className="flex items-center justify-between px-[2%] py-4 text-[13px]"><span aria-hidden className="text-xl">◣</span><span className="flex items-center gap-7"><a href="#" className="font-medium">API</a><a href="#" className="text-zinc-600">Pricing</a><a href="#" className="text-zinc-600">Documentation</a><a href="#" className="rounded-full bg-[#1a1a1a] px-4 py-2 font-medium text-white">Start Building</a></span></nav>
      <h1 className="in mx-auto mt-[2.4%] max-w-[22ch] text-[clamp(2.2rem,4.5vw,4.2rem)] leading-[1.08] font-light tracking-[-.035em]">{title}</h1>
      <p className="in mx-auto mt-[1.8%] max-w-[30rem] text-[clamp(.9rem,1.45vw,1.35rem)] leading-snug" style={{ ["--d" as string]: ".1s" }}>Build and scale creative products with the world's most popular and intuitive <b>Video</b> and <b>Image</b> generation models with Lumen API</p>
      <a href="#" className="in mx-auto mt-[3%] rounded-full bg-[#1a1a1a] px-6 py-3 text-[clamp(1.1rem,1.8vw,1.7rem)] text-white transition-transform hover:scale-105" style={{ ["--d" as string]: ".2s" }}>{cta}</a>
      <div aria-hidden className="rise relative mx-auto mt-[4%] aspect-[2/1] w-[45%] min-w-64 overflow-hidden rounded-t-full">
        <div className="prism absolute inset-0 blur-[1px]" />
        {[["-20deg", "0s", "14%", "#ffffffaa"], ["35deg", "-1.5s", "44%", "#ffffff88"], ["-55deg", "-3s", "62%", "#fde68a99"], ["70deg", "-2s", "30%", "#bfdbfe99"], ["10deg", "-4s", "75%", "#ffffff77"]].map(([r, d, l, c], i) => (
          <span key={i} className="facet absolute bottom-0 h-[120%] w-[18%] mix-blend-overlay" style={{ left: l, transform: `rotate(${r})`, background: `linear-gradient(0deg,${c},transparent)`, ["--r" as string]: r, ["--d" as string]: d }} />
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,transparent_30%,#0003_100%)]" />
        <div className="absolute bottom-0 left-[8%] h-[45%] w-[22%] rounded-[40%] bg-gradient-to-r from-[#d77a4a] to-[#f0a070] opacity-80 blur-sm" />
      </div>
      <a href="#" className="absolute right-[2%] bottom-[2.5%] rounded-full border border-zinc-800 bg-white px-3 py-1.5 text-[11px] font-medium">Get Help</a>
    </section>
  );
}
