"use client";
import { cn, useReducedMotion } from "@kinetik/core";

const css = `
.k-hfp .frame{stroke-dasharray:1400;stroke-dashoffset:1400;animation:k-hfp-draw 1.8s cubic-bezier(.65,0,.35,1) .2s forwards}
@keyframes k-hfp-draw{to{stroke-dashoffset:0}}
.k-hfp .title{animation:k-hfp-in 1s ease-out 1.1s both}
@keyframes k-hfp-in{from{opacity:0;transform:translateY(8px)}}
.k-hfp .far{animation:k-hfp-drift 18s ease-in-out infinite alternate}
.k-hfp .near{animation:k-hfp-drift 12s ease-in-out infinite alternate-reverse}
@keyframes k-hfp-drift{to{transform:translateX(-3%)}}
@media (prefers-reduced-motion:reduce){.k-hfp *{animation:none!important;stroke-dashoffset:0!important}}
[data-reduce-motion] .k-hfp *{animation:none!important;stroke-dashoffset:0!important}`;

/** Foundation/mission hero: a rounded alpine scene with parallax ridges, a tiny hiker climbing and a white frame that draws itself around the name. */
export function HeroFramedPeak({ title = "Open Foundation", line = "Building an internet where people come before profits", className }: { title?: string; line?: string; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <section className={cn("k-hfp bg-[#f6f5ff] px-4 pt-6 pb-10", className)}>
      <style href="k-hfp" precedence="kinetik">{css}</style>
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-b from-[#3d6fd1] via-[#7ea3e6] to-[#cfe0f7]">
        <svg viewBox="0 0 600 300" aria-hidden className="block h-auto w-full">
          <path className="far" d="M-20 230 L60 170 L120 200 L210 120 L300 190 L380 140 L470 185 L560 130 L640 200 V300 H-20Z" fill="#dce7f7" />
          <path className="near" d="M-20 300 L120 230 L240 160 L330 112 L420 175 L520 220 L640 250 V300Z" fill="#fff" />
          <path className="near" d="M330 112 L360 150 L320 190 L290 160Z" fill="#e6eefb" />
          <g transform={reduced ? "translate(255 160)" : undefined}>{!reduced && <animateMotion dur="14s" repeatCount="indefinite" path="M180 210 Q 260 150 330 118" />}<rect x="-2" y="-9" width="4" height="9" rx="1.5" fill="#1f2937" /><circle cy="-11" r="2" fill="#1f2937" /></g>
          <rect className="frame" x="150" y="40" width="300" height="200" fill="none" stroke="#fff" strokeWidth="6" />
        </svg>
        <h1 className="title absolute top-[22%] left-1/2 w-[46%] -translate-x-1/2 text-[clamp(1.6rem,5vw,3rem)] leading-[1] font-semibold tracking-tight text-white drop-shadow">{title}</h1>
      </div>
      <p className="mx-auto mt-6 max-w-4xl px-2 text-lg text-[#3b2f8f]"><span className="text-[#6d5bd0]">{line.split(" ").slice(0, 4).join(" ")}</span> <b className="font-semibold">{line.split(" ").slice(4).join(" ")}</b></p>
    </section>
  );
}
