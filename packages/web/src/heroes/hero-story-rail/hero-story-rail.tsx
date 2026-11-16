"use client";
import { cn } from "@kinetik/core";

const css = `
.k-hsr .rail{animation:k-hsr-scroll 40s linear infinite}
.k-hsr:hover .rail{animation-play-state:paused}
@keyframes k-hsr-scroll{to{transform:translateX(-50%)}}
.k-hsr .card img,.k-hsr .card .ph{transition:transform .8s cubic-bezier(.16,1,.3,1)}
.k-hsr .card:hover img,.k-hsr .card:hover .ph{transform:scale(1.06)}
.k-hsr .in{animation:k-hsr-in .9s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hsr-in{from{opacity:0;transform:translateY(18px)}}
@media (prefers-reduced-motion:reduce){.k-hsr *{animation:none!important}.k-hsr .rail{overflow-x:auto}}
[data-reduce-motion] .k-hsr *{animation:none!important}`;

type Story = { brand: string; cta: string; image?: string };
const defaults: Story[] = [
  { brand: "▲ NORTHWIND", cta: "Read story" }, { brand: "≋ LUMEN LABS", cta: "Visit site" }, { brand: "Halcyon", cta: "Visit site" },
  { brand: "◐ ORBITAL", cta: "Read story" }, { brand: "Fernway", cta: "Visit site" }, { brand: "KITE/OS", cta: "Read story" },
];
const tints = ["#1e3a8a", "#065f46", "#7c2d12", "#4c1d95", "#164e63", "#831843"];

/** Customer-story hero: centered headline over an endless rail of tall photo cards with brand marks; hover pauses the rail and zooms the card. */
export function HeroStoryRail({ title = "Powering teams to move faster", subtitle = "From startups to enterprises, 144K companies in 194 countries build standout sites with us.", stories = defaults, images = [], className }: { title?: string; subtitle?: string; stories?: Story[]; images?: string[]; className?: string }) {
  const list = [...stories, ...stories];
  return (
    <section className={cn("k-hsr overflow-hidden bg-black py-12 text-white", className)}>
      <style href="k-hsr" precedence="kinetik">{css}</style>
      <div className="mx-auto max-w-xl px-6 text-center">
        <h1 className="in text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="in mt-3 text-sm text-white/60" style={{ ["--d" as string]: ".1s" }}>{subtitle}</p>
        <div className="in mt-5 flex justify-center gap-2 text-xs font-medium" style={{ ["--d" as string]: ".2s" }}>
          <a href="#" className="rounded-full bg-white px-3.5 py-1.5 text-black">Contact sales</a>
          <a href="#" className="rounded-full bg-white/10 px-3.5 py-1.5 hover:bg-white/20">Explore Enterprise</a>
        </div>
      </div>
      <div className="mt-10 overflow-hidden">
        <ul className="rail flex w-max gap-3 pr-3">
          {list.map((s, i) => {
            const img = images[i % stories.length] ?? images[i % Math.max(images.length, 1)];
            return (
              <li key={i} aria-hidden={i >= stories.length} className="card relative h-60 w-48 shrink-0 overflow-hidden rounded-xl border border-white/10">
                {img ? <img src={img} alt="" className="absolute inset-0 size-full object-cover" /> : <div className="ph absolute inset-0" style={{ background: `radial-gradient(circle at 30% 20%,${tints[i % tints.length]},#000 80%)` }} />}
                <div className="absolute inset-0 bg-black/45" />
                <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-lg font-bold tracking-tight">{s.brand}</p>
                <a href="#" tabIndex={i >= stories.length ? -1 : 0} className="absolute inset-x-0 bottom-4 text-center text-xs text-white/85">{s.cta} ›</a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
