"use client";
import { cn } from "@kinetik/core";

const css = `
.k-hds .sky{background:linear-gradient(180deg,#3b4a6b 0%,#a77c6a 55%,#e8b48a 75%,#3a2f2c 100%);animation:k-hds-sky 16s ease-in-out infinite alternate}
@keyframes k-hds-sky{to{filter:hue-rotate(-12deg) brightness(.85)}}
.k-hds .city{animation:k-hds-pan 30s ease-in-out infinite alternate}
@keyframes k-hds-pan{to{transform:translateX(-4%)}}
.k-hds .win{animation:k-hds-twinkle var(--s) steps(2) infinite;animation-delay:var(--d)}
@keyframes k-hds-twinkle{50%{opacity:.15}}
.k-hds .in{animation:k-hds-in 1.4s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hds-in{from{opacity:0;letter-spacing:.08em;filter:blur(10px)}}
@media (prefers-reduced-motion:reduce){.k-hds *{animation:none!important}}
[data-reduce-motion] .k-hds *{animation:none!important}`;

const towers = [[0, 60], [30, 110], [62, 80], [90, 150], [118, 95], [150, 190], [176, 120], [208, 70], [236, 160], [262, 105], [296, 220], [322, 140], [356, 85], [384, 175], [414, 115], [446, 75], [476, 135], [508, 95], [540, 165], [570, 80]] as const;

/** Corporate hero: thin oversized type over a dusk city skyline that slowly pans while lit windows flicker on and off. */
export function HeroDuskSkyline({ title = "The world's identity company", subtitle = "We free everyone to safely use any technology — with seamless, secure access, authentication and authorization.", className }: { title?: string; subtitle?: string; className?: string }) {
  return (
    <section className={cn("k-hds relative isolate flex flex-col items-center justify-start overflow-hidden px-6 pt-14 pb-40 text-center text-white", className)}>
      <style href="k-hds" precedence="kinetik">{css}</style>
      <div aria-hidden className="sky absolute inset-0 -z-20" />
      <svg aria-hidden viewBox="0 0 600 260" preserveAspectRatio="xMidYMax slice" className="city absolute inset-x-0 bottom-0 -z-10 h-[75%] w-[110%]">
        {towers.map(([x, h], i) => (
          <g key={i}>
            <rect x={x} y={260 - h} width="28" height={h} fill={i % 2 ? "#1f1b24" : "#2a2530"} />
            {Array.from({ length: Math.floor(h / 22) }, (_, r) => <rect key={r} className="win" x={x + 6 + (r % 2) * 10} y={260 - h + 10 + r * 20} width="5" height="7" fill="#ffd8a0" opacity=".8" style={{ ["--s" as string]: `${3 + ((i + r) % 5)}s`, ["--d" as string]: `${-((i * r) % 7)}s` }} />)}
          </g>
        ))}
      </svg>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_45%,#0009,transparent_70%)]" aria-hidden />
      <h1 className="in max-w-3xl text-5xl leading-[1.05] font-light tracking-tight sm:text-6xl">{title}</h1>
      <p className="in mt-6 max-w-xl text-sm text-white/90 [text-shadow:0_1px_8px_#000a]" style={{ ["--d" as string]: ".3s" }}>{subtitle}</p>
    </section>
  );
}
