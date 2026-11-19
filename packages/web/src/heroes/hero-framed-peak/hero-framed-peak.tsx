"use client";
import { cn, useReducedMotion } from "@kinetik/core";

const FONT = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;800&display=swap";
const css = `
.k-hfp{font-family:Nunito,ui-sans-serif,system-ui,sans-serif}
.k-hfp .frame{stroke-dasharray:1400;stroke-dashoffset:1400;animation:k-hfp-draw 1.8s cubic-bezier(.65,0,.35,1) .2s forwards}
@keyframes k-hfp-draw{to{stroke-dashoffset:0}}
.k-hfp .title{animation:k-hfp-in 1s ease-out 1.1s both}
@keyframes k-hfp-in{from{opacity:0;transform:translateY(8px)}}
.k-hfp .far{animation:k-hfp-drift 18s ease-in-out infinite alternate}
.k-hfp .near{animation:k-hfp-drift 12s ease-in-out infinite alternate-reverse}
@keyframes k-hfp-drift{to{transform:translateX(-2%)}}
@media (prefers-reduced-motion:reduce){.k-hfp *{animation:none!important;stroke-dashoffset:0!important}}
[data-reduce-motion] .k-hfp *{animation:none!important;stroke-dashoffset:0!important}`;

/** Foundation/mission hero: lavender nav, a rounded alpine photo card with a hiker climbing and a white square frame drawing itself around the name, then the mission copy. */
export function HeroFramedPeak({ brand = "Prism", title = "Prism Foundation", className }: { brand?: string; title?: string; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <section className={cn("k-hfp flex flex-col overflow-hidden bg-gradient-to-b from-[#f6f5ff] via-[#f8f7ff] to-white text-[#1b1340]", className)}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hfp" precedence="kinetik">{css}</style>
      <nav className="flex items-center justify-between px-[6.3%] py-3 text-[12px] whitespace-nowrap">
        <span className="flex items-center gap-6"><b className="text-[19px] font-extrabold tracking-tight text-[#6d4aff]">{brand}</b><span className="hidden gap-6 font-semibold lg:flex"><a href="#">Products ⌄</a><a href="#">{brand} for business</a><a href="#">Who we are ⌄</a><a href="#">Resources & support ⌄</a></span></span>
        <span className="flex items-center gap-5 font-semibold"><a href="#" className="rounded-full bg-[#6d4aff] px-4 py-2 text-white">Create a free account</a><a href="#">Sign in</a></span>
      </nav>
      <div className="relative mx-[8.7%] mt-1 overflow-hidden rounded-[22px]">
        <svg viewBox="0 0 1200 560" aria-hidden className="block h-auto w-full">
          <defs><linearGradient id="k-hfp-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3f6db8" /><stop offset=".6" stopColor="#7aa0d8" /><stop offset="1" stopColor="#b9cde9" /></linearGradient><linearGradient id="k-hfp-snow" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#d6e2f2" /></linearGradient></defs>
          <rect width="1200" height="560" fill="url(#k-hfp-sky)" />
          <path className="far" d="M-20 430 L90 400 L180 425 L300 380 L380 410 L470 395 L560 420 L1220 430 V560 H-20Z" fill="#dfe8f5" />
          <path className="near" d="M-20 560 L150 500 L330 420 L470 330 L560 270 L640 300 L760 360 L900 420 L1060 470 L1220 500 V560Z" fill="url(#k-hfp-snow)" />
          <path className="near" d="M560 270 L600 330 L540 420 L470 330Z" fill="#c9d7ea" opacity=".7" />
          <path className="near" d="M640 300 L700 380 L880 520 L760 360Z" fill="#cbd8ea" opacity=".6" />
          <g transform={reduced ? "translate(612 352)" : undefined}>{!reduced && <animateMotion dur="16s" repeatCount="indefinite" path="M540 470 Q 590 400 612 352 T 625 300" />}<rect x="-4" y="-24" width="9" height="22" rx="3" fill="#20252e" /><circle cy="-28" r="4.5" fill="#20252e" /><path d="M-6 -2 L-8 8 M4 -2 L6 8" stroke="#20252e" strokeWidth="3" /></g>
          <rect className="frame" x="250" y="60" width="450" height="430" fill="none" stroke="#fff" strokeWidth="9" />
        </svg>
        <h1 className="title absolute top-[17%] left-[26%] text-[clamp(1.6rem,3.75vw,3.5rem)] leading-[1.02] font-extrabold tracking-[-.01em] text-white">{title.split(" ").map((w) => <span key={w} className="block">{w}</span>)}</h1>
      </div>
      <div className="mx-auto max-w-[46rem] flex-1 px-6 pt-[6%] pb-6">
        <h2 className="text-[clamp(1.1rem,1.75vw,1.6rem)] font-normal text-[#5b4fc4]">Building an Internet <b className="font-semibold text-[#1b1340]">where people come before profits</b></h2>
        <p className="mt-4 text-[13px] leading-relaxed text-[#3b3570]">{brand} was created to serve the world, and the non-profit {brand} Foundation ensures that this can never change. As {brand}'s primary shareholder, the foundation exercises its control to ensure that {brand} does not deviate from our mission to build a better internet that serves the interests of all of society.</p>
      </div>
    </section>
  );
}
