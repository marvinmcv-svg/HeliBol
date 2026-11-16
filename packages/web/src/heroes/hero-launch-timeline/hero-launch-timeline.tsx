"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

type Slot = { date: string; banner: string; tone: string };
const defaults: Slot[] = [
  { date: "January 1, 2026 at 12:00am", banner: "Drop in on our biggest sale", tone: "from-[#1e293b] to-[#334155]" },
  { date: "January 5, 2026 at 12:00am", banner: "New season. New colours.", tone: "from-[#7c2d12] to-[#c2410c]" },
  { date: "January 9, 2026 at 9:00am", banner: "Members get early access", tone: "from-[#14532d] to-[#15803d]" },
];
const index = ["Assistant", "Agentic", "Online", "Retail", "Marketing", "Checkout", "Operations"];

/** Release-notes hero: a storefront preview whose banner swaps as a vertical schedule timeline ticks through each planned launch. */
export function HeroLaunchTimeline({ title = "Test and time your launches with Rollouts", subtitle = "Schedule theme changes and A/B test them, built right into the admin.", slots = defaults, className }: { title?: string; subtitle?: string; slots?: Slot[]; className?: string }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setI((n) => (n + 1) % slots.length), 2600);
    return () => clearInterval(t);
  }, [reduced, slots.length]);
  return (
    <section className={cn("grid grid-cols-[110px_1fr] gap-4 overflow-hidden bg-[#ddd9cf] p-5 text-[#191919]", className)}>
      <ol className="flex flex-col justify-end text-sm leading-[1.05] font-bold tracking-tight text-zinc-500">
        {index.map((x, k) => <li key={x} className={cn("flex justify-between", k === 2 && "border-b border-black text-black")}><span>{x}</span><span className="font-serif text-[9px] font-normal">{["I", "II", "III", "IV", "V", "VI", "VII"][k]}</span></li>)}
      </ol>
      <div>
        <h1 className="text-3xl leading-tight font-bold tracking-tight">{title}</h1>
        <p className="mt-1 max-w-md font-serif text-[15px] leading-snug">{subtitle}</p>
        <div className="mt-5 flex gap-6">
          <div className="relative flex-1 overflow-hidden rounded-lg bg-white shadow-xl">
            <span className="absolute top-2 left-2 z-10 rounded-md bg-white px-2 py-1 text-[10px] shadow">Rollouts / {slots[i].date.split(" at")[0]} <b className="ml-1 rounded bg-amber-100 px-1 text-amber-700">Scheduled</b></span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={i} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className={cn("grid h-44 place-items-center bg-gradient-to-br text-center text-white", slots[i].tone)}>
                <p className="px-6 text-xl font-semibold tracking-tight uppercase">{slots[i].banner}<span className="mt-2 block text-[10px] font-normal tracking-widest">SHOP NOW</span></p>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-around py-3">{[0, 1, 2, 3].map((k) => <span key={k} className="size-8 rounded-full bg-zinc-200" />)}</div>
          </div>
          <ol className="relative flex w-44 flex-col justify-around border-l border-zinc-700 pl-3" aria-label="Schedule">
            {slots.map((s, k) => (
              <li key={s.date} className="relative">
                <span className={cn("absolute top-1/2 -left-[17px] size-2.5 -translate-y-1/2 rounded-full border border-zinc-700 transition-colors", k === i ? "bg-zinc-900" : "bg-[#ddd9cf]")} />
                <span className={cn("block rounded-md bg-white px-2 py-1.5 text-[10px] shadow transition-all duration-500", k === i ? "opacity-100" : "opacity-40")}>{s.date} EST</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
