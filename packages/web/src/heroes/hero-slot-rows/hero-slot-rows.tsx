"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

/** Capability hero: "AI that" on the left; on the right a ruled stack of huge phrases rolls upward like a slot reel, the centred row in full ink. */
export function HeroSlotRows({ lead = "AI that", phrases = ["Writes copy", "Makes videos", "Stays on-brand", "Creates images", "Ships campaigns", "Learns your voice"], className }: { lead?: string; phrases?: string[]; className?: string }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(1);
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setI((k) => (k + 1) % phrases.length), 1800);
    return () => clearInterval(t);
  }, [reduced, phrases.length]);
  const ROW = 84;
  return (
    <section className={cn("grid overflow-hidden border-y border-zinc-200 bg-white text-zinc-900 md:grid-cols-[1fr_2.6fr]", className)}>
      <div className="flex flex-col justify-between border-zinc-200 p-6 md:border-r">
        <h1 className="text-5xl font-medium tracking-tight">{lead}<span className="sr-only"> {phrases.join(", ")}</span></h1>
        <a href="#" className="mt-10 w-fit rounded-full bg-black px-4 py-2 text-xs text-white">Get started</a>
      </div>
      <div aria-hidden className="relative h-[252px] self-center overflow-hidden [mask-image:linear-gradient(transparent,#000_20%,#000_80%,transparent)]">
        <motion.ul animate={{ y: -(i - 1) * ROW }} transition={reduced ? { duration: 0 } : spring.smooth} className="absolute inset-x-0 top-0">
          {phrases.map((p, k) => (
            <li key={p} style={{ height: ROW }} className={cn("flex items-center border-b border-zinc-200 px-6 text-[clamp(2rem,6vw,3.6rem)] font-medium tracking-tight transition-colors duration-500", k === i ? "text-zinc-900" : Math.abs(k - i) === 1 ? "text-zinc-400" : "text-zinc-200")}>{p}</li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
