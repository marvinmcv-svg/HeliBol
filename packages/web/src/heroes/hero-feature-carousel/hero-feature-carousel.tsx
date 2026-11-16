"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

type Feature = { tag: string; title: string; tone: string; art: string };
const defaults: Feature[] = [
  { tag: "Magic cut", title: "Replace hours of editing with a single click", tone: "bg-[#e6fbcf]", art: "✂" },
  { tag: "Text to speech", title: "Turn written content into natural voiceovers", tone: "bg-[#e9e6ff]", art: "♪" },
  { tag: "Auto subtitles", title: "Accurate captions in 100+ languages", tone: "bg-[#fff1c7]", art: "Aa" },
  { tag: "Eye contact", title: "Look into the lens, even when you read", tone: "bg-[#d9f3ff]", art: "◉" },
];

/** Feature-led hero: condensed uppercase headline with arrow controls driving a spring-physics card slider that also auto-advances. */
export function HeroFeatureCarousel({ title = "Streamline video with AI editing", features = defaults, className }: { title?: string; features?: Feature[]; className?: string }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = (d: number) => setI((k) => (k + d + features.length) % features.length);
  useEffect(() => {
    if (reduced || paused) return;
    const t = setInterval(() => setI((k) => (k + 1) % features.length), 3200);
    return () => clearInterval(t);
  }, [reduced, paused, features.length]);
  return (
    <section className={cn("overflow-hidden bg-[#ececec] p-6 text-[#111]", className)} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="grid gap-6 md:grid-cols-[1fr_1.7fr]">
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-[clamp(2.2rem,5vw,3.4rem)] leading-[.92] font-black tracking-[-.03em] uppercase [transform:scaleX(.86)] origin-left">{title}</h1>
            <a href="#" className="mt-5 inline-block rounded-full bg-gradient-to-r from-[#7cf2a8] to-[#b5f36d] px-4 py-2 text-xs font-medium">Explore all AI features</a>
          </div>
          <div className="mt-8 flex gap-3">
            <button type="button" aria-label="Previous feature" onClick={() => go(-1)} className="grid size-14 place-items-center rounded-full bg-white text-xl transition-transform hover:-translate-x-0.5 active:scale-95">←</button>
            <button type="button" aria-label="Next feature" onClick={() => go(1)} className="grid size-14 place-items-center rounded-full bg-white text-xl transition-transform hover:translate-x-0.5 active:scale-95">→</button>
          </div>
        </div>
        <div className="overflow-hidden" aria-roledescription="carousel">
          <motion.ul animate={{ x: `calc(${-i} * (78% + 12px))` }} transition={reduced ? { duration: 0 } : spring.smooth} className="flex gap-3">
            {features.map((f, k) => (
              <li key={f.tag} aria-hidden={k !== i} className="w-[78%] shrink-0 overflow-hidden rounded-2xl bg-white">
                <div className={cn("grid h-36 place-items-center text-5xl", f.tone)}><span className="grid size-20 place-items-center rounded-2xl bg-[#222] text-3xl text-white shadow-lg">{f.art}</span></div>
                <div className="p-5"><p className="text-[10px] font-bold tracking-widest uppercase">{f.tag}</p><p className="mt-3 text-xl leading-tight">{f.title}</p></div>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
      <div className="mx-auto mt-6 flex max-w-xl items-center justify-between rounded-full bg-white px-5 py-2 text-sm">Create videos 8× faster with Enterprise<a href="#" className="rounded-full bg-[#b5f36d] px-3 py-1.5 text-xs">Talk to sales</a></div>
    </section>
  );
}
