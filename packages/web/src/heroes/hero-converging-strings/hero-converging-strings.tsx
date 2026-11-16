"use client";
import { cn } from "@kinetik/core";

const css = `
.k-hcs .strings{transform-origin:50% 100%;animation:k-hcs-sway 7s ease-in-out infinite alternate}
.k-hcs .strings.b{animation-duration:9s;animation-direction:alternate-reverse}
@keyframes k-hcs-sway{from{transform:skewX(-2.5deg)}to{transform:skewX(2.5deg)}}
.k-hcs .s{stroke-dasharray:500;stroke-dashoffset:500;animation:k-hcs-draw 1.6s cubic-bezier(.65,0,.35,1) forwards;animation-delay:calc(var(--i)*30ms)}
@keyframes k-hcs-draw{to{stroke-dashoffset:0}}
.k-hcs .in{animation:k-hcs-in 1s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hcs-in{from{opacity:0;transform:translateY(20px)}}
.k-hcs .magic{display:inline-block;animation:k-hcs-wiggle 2.5s ease-in-out infinite}
@keyframes k-hcs-wiggle{50%{transform:rotate(14deg) scale(1.1)}}
@media (prefers-reduced-motion:reduce){.k-hcs *{animation:none!important;stroke-dashoffset:0!important}}
[data-reduce-motion] .k-hcs *{animation:none!important;stroke-dashoffset:0!important}`;

/** Branding-agency hero: dozens of hand-strung lines fan down from the top edge and converge behind the team area, swaying like tensioned string. */
export function HeroConvergingStrings({ text = "Bureau is a digital branding agency. We craft impactful experiences with magic people.", cities = ["Coimbra", "&", "Porto"], className }: { text?: string; cities?: string[]; className?: string }) {
  const tops = Array.from({ length: 22 }, (_, i) => i * 28 - 10);
  const focus = (i: number) => 230 + (i % 7) * 22;
  const words = text.split(" ");
  return (
    <section className={cn("k-hcs relative isolate min-h-[460px] overflow-hidden bg-[#f2f2f0] px-6 pt-4 text-[#111]", className)}>
      <style href="k-hcs" precedence="kinetik">{css}</style>
      <svg aria-hidden viewBox="0 0 600 400" preserveAspectRatio="none" className="absolute inset-0 -z-10 size-full">
        <g className="strings" stroke="#1a1a1a" strokeWidth=".9" fill="none">{tops.filter((_, i) => i % 2 === 0).map((x, i) => <path key={x} className="s" style={{ ["--i" as string]: i }} d={`M${x} 0 Q ${(x + focus(i)) / 2} 160 ${focus(i)} 330`} />)}</g>
        <g className="strings b" stroke="#1a1a1a" strokeWidth=".7" fill="none">{tops.filter((_, i) => i % 2 === 1).map((x, i) => <path key={x} className="s" style={{ ["--i" as string]: i + 11 }} d={`M${x} 0 Q ${(x + focus(i + 3)) / 2} 180 ${focus(i + 3)} 320`} />)}</g>
        <ellipse cx="300" cy="360" rx="190" ry="40" fill="#1a1a1a" opacity=".08" />
      </svg>
      <div className="flex justify-between text-[11px]">{cities.map((c) => <span key={c}>{c}</span>)}</div>
      <h1 className="in mt-6 max-w-3xl text-[clamp(1.6rem,4.4vw,2.8rem)] leading-[1.05] font-medium tracking-tight">
        {words.map((w, i) => (w === "magic" ? <span key={i}>{w}<span aria-hidden className="magic">✺</span> </span> : <span key={i}>{w} </span>))}
      </h1>
      <div aria-hidden className="absolute inset-x-[22%] bottom-0 flex h-36 items-end justify-center gap-3">
        {[0.8, 1, 0.9, 1.05, 0.85, 1, 0.95].map((s, i) => (
          <span key={i} className="in flex w-12 flex-col items-center" style={{ height: `${s * 100}%`, ["--d" as string]: `${0.5 + i * 0.06}s` }}>
            <span className="size-7 shrink-0 rounded-full bg-[#2a2a2a]" />
            <span className="mt-1 w-full flex-1 rounded-t-[18px] bg-[#1a1a1a]" />
          </span>
        ))}
      </div>
    </section>
  );
}
