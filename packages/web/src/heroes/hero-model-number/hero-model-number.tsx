"use client";
import { cn } from "@kinetik/core";

const css = `
.k-hmn .promo{animation:k-hmn-promo 20s linear infinite}
@keyframes k-hmn-promo{to{transform:translateX(-50%)}}
.k-hmn .lamp{animation:k-hmn-lamp 2.8s ease-in-out infinite}
@keyframes k-hmn-lamp{50%{filter:drop-shadow(0 0 22px #ff2b2b) brightness(1.3)}}
.k-hmn .num{animation:k-hmn-num 1.4s cubic-bezier(.16,1,.3,1) .2s both}
@keyframes k-hmn-num{from{opacity:0;transform:translateX(-12%);letter-spacing:.15em}}
.k-hmn .frame{animation:k-hmn-frame 2s cubic-bezier(.16,1,.3,1) both}
@keyframes k-hmn-frame{from{opacity:0;transform:scale(1.15) rotate(-3deg)}}
@media (prefers-reduced-motion:reduce){.k-hmn *{animation:none!important}}
[data-reduce-motion] .k-hmn *{animation:none!important}`;

/** Product-glamour hero: a moody close-up of a machined frame with a pulsing red lamp, a huge model number sliding in and a looping promo strip. */
export function HeroModelNumber({ model = "S6", promo = "Reserve by July 31 · Get 1 year of theft protection free · Use code RIDESECURE", blurb = "The wait's over. Introducing our ultimate e-bike.", className }: { model?: string; promo?: string; blurb?: string; className?: string }) {
  return (
    <section className={cn("k-hmn flex flex-col overflow-hidden bg-[#e9ff3b]", className)}>
      <style href="k-hmn" precedence="kinetik">{css}</style>
      <div className="overflow-hidden py-1.5 font-mono text-[10px] tracking-wider text-black uppercase"><div className="promo flex w-max gap-16 pr-16">{Array.from({ length: 4 }, (_, i) => <span key={i} aria-hidden={i > 0}>{promo}</span>)}</div></div>
      <div className="relative min-h-[420px] flex-1 overflow-hidden bg-[radial-gradient(ellipse_at_70%_30%,#4a4a4f,#121214_65%)] text-white">
        <svg aria-hidden viewBox="0 0 600 400" className="frame absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice">
          <defs><linearGradient id="k-hmn-g" x1="0" x2="1"><stop offset="0" stopColor="#1c1c1f" /><stop offset=".5" stopColor="#5c5c63" /><stop offset="1" stopColor="#202024" /></linearGradient></defs>
          <circle cx="40" cy="300" r="230" fill="none" stroke="#0d0d0f" strokeWidth="26" />
          <path d="M220 60 C 260 160 300 260 330 420" stroke="url(#k-hmn-g)" strokeWidth="46" fill="none" strokeLinecap="round" />
          <path d="M260 210 C 360 200 470 190 620 160" stroke="url(#k-hmn-g)" strokeWidth="30" fill="none" />
          <ellipse cx="225" cy="55" rx="70" ry="34" fill="#18181b" />
          <path className="lamp" d="M262 128 c 18 -8 34 4 30 20 c -4 14 -24 18 -36 8 c -8 -8 -4 -22 6 -28z" fill="#ff2b2b" />
        </svg>
        <h1 className="num absolute bottom-6 left-8 text-[clamp(5rem,18vw,10rem)] leading-none font-light tracking-tight">{model}</h1>
        <div className="absolute top-1/2 right-8 max-w-44 text-xs">
          <p>{blurb}</p>
          <a href="#" className="mt-3 inline-flex items-center gap-2 transition-transform hover:translate-x-1"><span className="grid size-5 place-items-center border border-white/70">↗</span>Explore</a>
        </div>
        <p className="absolute right-8 bottom-6 text-xs">Reserve now for €150 ·</p>
      </div>
    </section>
  );
}
