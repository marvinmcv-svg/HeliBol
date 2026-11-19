"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

const FONT = "https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600&display=swap";
type Feature = { tag: string; title: string; tone: string; art: "cut" | "voice" | "subs" | "eyes" };
const defaults: Feature[] = [
  { tag: "Magic cut", title: "Replace hours of editing with a single click", tone: "#e6fbc9", art: "cut" },
  { tag: "Text to speech", title: "Convert written content into spoken audio with our text to speech tool.", tone: "#ececec", art: "voice" },
  { tag: "Auto subtitles", title: "Accurate captions in 100+ languages", tone: "#fff1c7", art: "subs" },
  { tag: "Eye contact", title: "Look into the lens, even when you read", tone: "#d9f3ff", art: "eyes" },
];
const Face = ({ tint }: { tint: string }) => <span className="relative block h-full flex-1 overflow-hidden rounded-xl" style={{ background: `linear-gradient(180deg,${tint},#e9d8c8)` }}><span className="absolute top-[16%] left-1/2 h-[46%] w-[46%] -translate-x-1/2 rounded-[45%] bg-[#f2d2bd]" /><span className="absolute top-[8%] left-1/2 h-[30%] w-[60%] -translate-x-1/2 rounded-t-full bg-[#e9c98f]" /><span className="absolute bottom-0 left-1/2 h-[34%] w-[80%] -translate-x-1/2 rounded-t-[40%] bg-[#4b4b4b]" /></span>;

/** Feature-led video-AI hero: announcement strip and nav, a condensed uppercase headline with gradient pill and big round arrows that drive a spring-physics card slider (auto-advances), and an enterprise banner pill. */
export function HeroFeatureCarousel({ title = "Streamline video with AI editing", features = defaults, className }: { title?: string; features?: Feature[]; className?: string }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = (d: number) => setI((k) => (k + d + features.length) % features.length);
  useEffect(() => {
    if (reduced || paused) return;
    const t = setInterval(() => setI((k) => (k + 1) % features.length), 5000);
    return () => clearInterval(t);
  }, [reduced, paused, features.length]);
  return (
    <section className={cn("flex flex-col overflow-hidden bg-[#ececec] text-[#111]", className)} style={{ fontFamily: "Inter,ui-sans-serif,sans-serif" }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <p className="bg-[#e2dcff] py-1.5 text-center text-[11px] text-[#4b3fa8]">Ever completed corporate training and thought it could be better? Share your thoughts <a href="#" className="ml-1 rounded-full bg-[#6d5dfc] px-2 py-0.5 text-white">Take survey</a></p>
      <nav className="flex items-center justify-between bg-white px-[1.6%] py-3 text-[12px] font-medium"><span className="flex items-center gap-7"><b className="text-[21px] font-black tracking-tight">VEDO.IO</b><span className="hidden gap-6 lg:flex"><a href="#">Products ⌄</a><a href="#">Use Cases ⌄</a><a href="#">Resources ⌄</a><a href="#">For Business ⌄</a><a href="#">Pricing</a></span></span><span className="flex items-center gap-3"><a href="#">Talk to Sales</a><a href="#" className="rounded-md bg-[#ececec] px-3 py-2">Login</a><a href="#" className="rounded-md bg-black px-3 py-2 text-white">Sign Up</a></span></nav>
      <div className="grid flex-1 grid-cols-[38%_1fr] pt-[3.5%] pl-[4%]">
        <div className="flex flex-col justify-between pb-[2%]">
          <div>
            <h1 className="text-[clamp(2.4rem,4.7vw,4.5rem)] leading-[.95] tracking-[-.005em] uppercase" style={{ fontFamily: "Anton,Impact,sans-serif" }}>{title.split(" ").reduce<string[]>((a, w, k) => { if (k < 2) a[0] = `${a[0] ?? ""} ${w}`; else a[1] = `${a[1] ?? ""} ${w}`; return a; }, []).map((l) => <span key={l} className="block">{l.trim()}</span>)}</h1>
            <a href="#" className="mt-[7%] inline-block rounded-full bg-gradient-to-r from-[#7ff2b3] to-[#c3f56f] px-4 py-2.5 text-[12px] font-medium">Explore all AI features</a>
          </div>
          <div className="flex gap-3">
            <button type="button" aria-label="Previous feature" onClick={() => go(-1)} className="grid size-[clamp(3rem,5vw,4.6rem)] place-items-center rounded-full bg-[#f5f5f5] text-2xl text-zinc-400 transition-transform hover:-translate-x-0.5 active:scale-95">←</button>
            <button type="button" aria-label="Next feature" onClick={() => go(1)} className="grid size-[clamp(3rem,5vw,4.6rem)] place-items-center rounded-full bg-white text-2xl transition-transform hover:translate-x-0.5 active:scale-95">→</button>
          </div>
        </div>
        <div className="overflow-hidden" aria-roledescription="carousel">
          <motion.ul animate={{ x: `calc(${-i} * (58% + 14px))` }} transition={reduced ? { duration: 0 } : spring.smooth} className="flex h-full gap-[14px] pb-[2%]">
            {features.map((f, k) => (
              <li key={f.tag} aria-hidden={k !== i} className="flex w-[58%] shrink-0 flex-col overflow-hidden rounded-2xl bg-white">
                <div className="grid h-[57%] place-items-center p-[4%]" style={{ background: f.tone }}>
                  {f.art === "cut" ? <span className="relative flex h-[85%] w-full gap-[18%] rounded-2xl bg-[#3a3a3a] p-[4%]"><Face tint="#f4e9dc" /><Face tint="#efe2d4" /><span className="absolute top-1/2 left-1/2 grid aspect-square w-[24%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#7ff2b3] text-3xl">✂</span></span>
                    : f.art === "voice" ? <span className="w-[80%] rounded-xl bg-white/70 p-4 text-left text-lg text-zinc-500">Today I'd like to share our annual report …<span className="mt-6 block text-xs">▶</span></span>
                    : <span className="grid size-24 place-items-center rounded-2xl bg-[#222] text-3xl text-white">{f.art === "subs" ? "Aa" : "◉"}</span>}
                </div>
                <div className="flex flex-1 flex-col justify-end p-[5%]"><p className="text-[10px] font-bold tracking-widest uppercase">{f.tag}</p><p className="mt-3 text-[clamp(1rem,1.6vw,1.55rem)] leading-tight">{f.title}</p></div>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
      <div className="mx-auto mb-[1.5%] flex w-[73%] items-center justify-between rounded-full bg-white py-2 pr-2 pl-6 text-[clamp(.8rem,1.15vw,1.1rem)] font-medium">Create professional videos 8X faster with our Enterprise plan<a href="#" className="rounded-full bg-[#9ef0a8] px-4 py-2 text-[12px]">Talk to Sales</a></div>
    </section>
  );
}
