"use client";
import { cn } from "@kinetik/core";

const css = `
.k-hsr .rail{animation:k-hsr-scroll 46s linear infinite}
.k-hsr:hover .rail{animation-play-state:paused}
@keyframes k-hsr-scroll{to{transform:translateX(-50%)}}
.k-hsr .card .ph{transition:transform .8s cubic-bezier(.16,1,.3,1)}
.k-hsr .card:hover .ph{transform:scale(1.06)}
.k-hsr .in{animation:k-hsr-in .9s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hsr-in{from{opacity:0;transform:translateY(18px)}}
@media (prefers-reduced-motion:reduce){.k-hsr *{animation:none!important}}
[data-reduce-motion] .k-hsr *{animation:none!important}`;

type Story = { brand: string; cta: string; image?: string };
const defaults: Story[] = [
  { brand: "▽ NORTHWIND", cta: "Read story" }, { brand: "IIBrightWave", cta: "Visit site" }, { brand: "Halcyon°", cta: "Visit site" },
  { brand: "S P R I N G", cta: "Read story" }, { brand: "◐ Orbital", cta: "Visit site" }, { brand: "KITE/OS", cta: "Read story" },
];
const tints = ["#1e3a5f", "#0c2440", "#4a2c1c", "#1f3b2a", "#2f1d47", "#3d1f2a"];

/** Customer-story hero on black: big two-line headline, two small pills, then an endless rail of tall photo cards with white brand marks — hover pauses it. */
export function HeroStoryRail({ title = "Powering teams to move faster", subtitle = "From startups to enterprises, 144K companies in 194 countries use Kinetik to build standout sites.", stories = defaults, images = [], className }: { title?: string; subtitle?: string; stories?: Story[]; images?: string[]; className?: string }) {
  const list = [...stories, ...stories];
  return (
    <section className={cn("k-hsr flex flex-col overflow-hidden bg-black pt-12 pb-6 text-white", className)}>
      <style href="k-hsr" precedence="kinetik">{css}</style>
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h1 className="in mx-auto max-w-[11ch] text-[clamp(2.6rem,5.4vw,5rem)] leading-[1.02] font-semibold tracking-[-.04em]">{title}</h1>
        <p className="in mx-auto mt-5 max-w-lg text-[clamp(.9rem,1.5vw,1.4rem)] leading-snug text-white/60" style={{ ["--d" as string]: ".1s" }}>{subtitle}</p>
        <div className="in mt-6 flex justify-center gap-2 text-[13px] font-medium" style={{ ["--d" as string]: ".2s" }}>
          <a href="#" className="rounded-full bg-white px-4 py-2 text-black">Contact sales</a>
          <a href="#" className="rounded-full bg-[#222] px-4 py-2 hover:bg-[#333]">Explore Enterprise</a>
        </div>
      </div>
      <div className="mt-12 flex-1 overflow-hidden">
        <ul className="rail -ml-[16rem] flex h-full w-max gap-4 pr-4">
          {list.map((s, i) => {
            const img = images.length ? images[i % images.length] : undefined;
            return (
              <li key={i} aria-hidden={i >= stories.length} className="card relative aspect-[3/4] h-full max-h-[30rem] min-h-72 shrink-0 overflow-hidden rounded-xl">
                <div className="ph absolute inset-0" style={{ background: img ? `center/cover url(${img})` : `radial-gradient(circle at 30% 20%,${tints[i % tints.length]},#000 85%)` }} />
                <div className="absolute inset-0 bg-black/30" />
                <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[clamp(1.3rem,2.4vw,2.2rem)] font-bold tracking-tight">{s.brand}</p>
                <a href="#" tabIndex={i >= stories.length ? -1 : 0} className="absolute inset-x-0 bottom-6 text-center text-sm font-medium">{s.cta} ›</a>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="mt-5 text-center text-sm text-white/70"><b className="text-white">◎ lumen</b> built their site with <b className="text-white">0 developers</b></p>
    </section>
  );
}
