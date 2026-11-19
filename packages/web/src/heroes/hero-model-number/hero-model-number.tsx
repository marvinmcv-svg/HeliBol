"use client";
import { cn } from "@kinetik/core";

const css = `
.k-hmn .lamp{animation:k-hmn-lamp 2.8s ease-in-out infinite}
@keyframes k-hmn-lamp{50%{filter:drop-shadow(0 0 26px #ff2b2b) brightness(1.3)}}
.k-hmn .num{animation:k-hmn-num 1.4s cubic-bezier(.16,1,.3,1) .2s both}
@keyframes k-hmn-num{from{opacity:0;transform:translateX(-12%)}}
.k-hmn .frame{animation:k-hmn-frame 2s cubic-bezier(.16,1,.3,1) both}
@keyframes k-hmn-frame{from{opacity:0;transform:scale(1.12) rotate(-2deg)}}
@media (prefers-reduced-motion:reduce){.k-hmn *{animation:none!important}}
[data-reduce-motion] .k-hmn *{animation:none!important}`;

/** Product-glamour hero: neon promo strip, a floating boxed header, and a moody machined e-bike close-up with a pulsing red lamp, a huge model number and a reserve line. */
export function HeroModelNumber({ model = "S6", brand = "VELOMOOV", promo = "Reserve the S6 by July 31 · Get 1 year of theft proof free · Use code 'RIDESECURE'", blurb = "The wait's over. Introducing our ultimate e-bike.", className }: { model?: string; brand?: string; promo?: string; blurb?: string; className?: string }) {
  return (
    <section className={cn("k-hmn flex flex-col overflow-hidden bg-white", className)}>
      <style href="k-hmn" precedence="kinetik">{css}</style>
      <div className="relative bg-[#ecff3c] py-1.5 text-center font-mono text-[10px] tracking-wider text-black uppercase">{promo}<button type="button" aria-label="Dismiss" className="absolute top-1/2 right-3 -translate-y-1/2">✕</button></div>
      <div className="relative mx-[0.5%] mb-[1.5%] flex-1 overflow-hidden bg-[radial-gradient(ellipse_at_55%_85%,#7a7a80_0,#3a3a3e_35%,#0f0f11_75%)] text-white">
        <svg aria-hidden viewBox="0 0 1440 800" className="frame absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="k-hmn-g" x1="0" x2="1"><stop offset="0" stopColor="#111113" /><stop offset=".45" stopColor="#56565c" /><stop offset=".55" stopColor="#6a6a70" /><stop offset="1" stopColor="#1a1a1d" /></linearGradient>
            <linearGradient id="k-hmn-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2b2b2e" /><stop offset="1" stopColor="#0c0c0d" /></linearGradient>
          </defs>
          <circle cx="40" cy="560" r="460" fill="none" stroke="#0a0a0b" strokeWidth="60" />
          <circle cx="40" cy="560" r="400" fill="none" stroke="#1a1a1c" strokeWidth="3" />
          {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M40 560 L ${40 + 400 * Math.cos(-0.2 - i * 0.16)} ${560 + 400 * Math.sin(-0.2 - i * 0.16)}`} stroke="#2a2a2d" strokeWidth="2" />)}
          <path d="M470 160 C 520 330, 600 520, 700 820" stroke="url(#k-hmn-g)" strokeWidth="90" fill="none" strokeLinecap="round" />
          <path d="M560 470 C 800 450, 1100 420, 1500 300" stroke="url(#k-hmn-g)" strokeWidth="60" fill="none" />
          <path d="M1100 430 C 1180 520, 1260 640, 1320 820" stroke="url(#k-hmn-g)" strokeWidth="34" fill="none" />
          <path d="M1250 150 C 1300 200, 1320 260, 1330 330" stroke="#1d1d20" strokeWidth="22" fill="none" strokeLinecap="round" />
          <ellipse cx="430" cy="110" rx="160" ry="85" fill="url(#k-hmn-s)" />
          <path d="M380 180 C 400 300, 470 330, 520 300" fill="none" stroke="#1a1a1c" strokeWidth="40" />
          <path className="lamp" d="M520 330 c 30 -14 66 6 58 40 c -7 28 -48 38 -72 18 c -18 -16 -12 -46 14 -58z" fill="#ff1f1f" />
        </svg>
        <header className="absolute top-[4%] left-1/2 flex w-[40%] min-w-56 -translate-x-1/2 items-center justify-between border border-white/15 bg-black/40 px-4 py-3.5 text-[13px] tracking-[.25em] backdrop-blur"><span aria-hidden>≡</span><span>{brand}</span><span aria-hidden>⛉</span></header>
        <h1 className="num absolute bottom-[12%] left-[9%] text-[clamp(6rem,19vw,18rem)] leading-[.8] font-normal tracking-[-.04em]">{model}</h1>
        <div className="absolute top-[39%] right-[7%] w-[15%] min-w-40 text-[clamp(.7rem,1.05vw,1rem)]">
          <p>{blurb}</p>
          <a href="#" className="mt-4 inline-flex items-center gap-2 transition-transform hover:translate-x-1"><span className="grid size-6 place-items-center border border-white/70 text-xs">↗</span>Explore</a>
        </div>
        <p className="absolute right-[2%] bottom-[5%] text-[clamp(.7rem,1.05vw,1rem)]">Reserve now for €150 ·</p>
      </div>
    </section>
  );
}
