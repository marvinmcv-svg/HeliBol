"use client";
import { cn } from "@kinetik/core";

const css = `
@property --pa{syntax:"<angle>";initial-value:0deg;inherits:false}
.k-hpa .prism{background:conic-gradient(from var(--pa) at 50% 100%,#f7d9a8,#ff9d6c,#e9e4ff,#93c5fd,#fdf2f8,#c4b5fd,#fcd34d,#f7d9a8);animation:k-hpa-rot 12s linear infinite}
@keyframes k-hpa-rot{to{--pa:360deg}}
.k-hpa .facet{animation:k-hpa-facet 5s ease-in-out infinite alternate;animation-delay:var(--d)}
@keyframes k-hpa-facet{to{transform:rotate(var(--r)) translateX(10px);opacity:.25}}
.k-hpa .in{animation:k-hpa-in 1s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hpa-in{from{opacity:0;transform:translateY(16px)}}
.k-hpa .rise{animation:k-hpa-rise 1.6s cubic-bezier(.16,1,.3,1) .3s both}
@keyframes k-hpa-rise{from{transform:translateY(40%)}}
@media (prefers-reduced-motion:reduce){.k-hpa *{animation:none!important}}
[data-reduce-motion] .k-hpa *{animation:none!important}`;

/** Creative-AI hero: centered statement above a half-dome window of slowly rotating prismatic light with sliding crystal facets. */
export function HeroPrismArc({ title = "Creative intelligence platform for magical AI products", subtitle = "Build and scale creative products with the most intuitive video and image generation models.", cta = "Start building", className }: { title?: string; subtitle?: string; cta?: string; className?: string }) {
  return (
    <section className={cn("k-hpa overflow-hidden bg-[#efefef] px-6 pt-12 text-center text-[#1a1a1a]", className)}>
      <style href="k-hpa" precedence="kinetik">{css}</style>
      <h1 className="in mx-auto max-w-2xl text-4xl leading-[1.08] tracking-tight sm:text-5xl">{title}</h1>
      <p className="in mx-auto mt-4 max-w-md text-sm text-zinc-600" style={{ ["--d" as string]: ".1s" }}>{subtitle}</p>
      <a href="#" className="in mt-6 inline-block rounded-full bg-[#1a1a1a] px-6 py-3 text-lg text-white transition-transform hover:scale-105" style={{ ["--d" as string]: ".2s" }}>{cta}</a>
      <div aria-hidden className="rise relative mx-auto mt-8 aspect-[2/1] w-full max-w-sm overflow-hidden rounded-t-full">
        <div className="prism absolute inset-0" />
        {[["-20deg", "0s", "20%"], ["35deg", "-1.5s", "48%"], ["-55deg", "-3s", "66%"], ["70deg", "-2s", "35%"]].map(([r, d, l], i) => (
          <span key={i} className="facet absolute bottom-0 h-[110%] w-1/4 bg-gradient-to-t from-white/70 to-transparent mix-blend-overlay" style={{ left: l, transform: `rotate(${r})`, ["--r" as string]: r, ["--d" as string]: d }} />
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,#fff8,transparent_60%)]" />
      </div>
    </section>
  );
}
