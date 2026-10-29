"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Droplets, Dumbbell, BookOpen, Moon } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";
import { haptic } from "../../_shared/phone";

const habits = [
  { id: "water", label: "Drink water", icon: Droplets, color: "#38bdf8" },
  { id: "move", label: "Move 30 min", icon: Dumbbell, color: "#f97316" },
  { id: "read", label: "Read 10 pages", icon: BookOpen, color: "#a78bfa" },
  { id: "sleep", label: "In bed by 11", icon: Moon, color: "#34d399" },
];

export function FlowHabitCheckIn({ initialStep = 0 }: { initialStep?: number }) {
  const [done, setDone] = useState<string[]>(initialStep >= 1 ? ["water", "read"] : []);
  const [burst, setBurst] = useState<string | null>(null);
  const all = done.length === habits.length || initialStep === 2;
  const pct = all ? 1 : done.length / habits.length;
  const streak = 11 + (all ? 1 : 0);

  const toggle = (id: string) => {
    const on = !done.includes(id);
    haptic(on ? "medium" : "light");
    setDone((d) => (on ? [...d, id] : d.filter((x) => x !== id)));
    if (on) {
      setBurst(id);
      setTimeout(() => setBurst(null), 600);
      if (done.length + 1 === habits.length) setTimeout(() => haptic("success"), 200);
    }
  };

  return (
    <div className="flex h-full flex-col bg-zinc-950 px-5 pt-14 pb-8 text-white">
      <p className="text-xs text-white/50">Thursday, Oct 29</p>
      <h2 className="text-2xl font-semibold tracking-tight">Today</h2>
      <div className="mt-5 flex items-center gap-5 rounded-3xl bg-white/5 p-5">
        <div className="relative size-24">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(255 255 255 / .1)" strokeWidth="10" />
            <motion.circle cx="50" cy="50" r="42" fill="none" stroke="url(#k-habit)" strokeWidth="10" strokeLinecap="round" pathLength={1} initial={false} animate={{ pathLength: pct }} transition={spring.gentle} />
            <defs><linearGradient id="k-habit"><stop stopColor="#f97316" /><stop offset="1" stopColor="#facc15" /></linearGradient></defs>
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <motion.span key={streak} initial={{ scale: 0.5 }} animate={{ scale: [0.5, 1.3, 1] }} transition={{ duration: 0.5 }} className="text-2xl" aria-hidden>
              🔥
            </motion.span>
          </div>
        </div>
        <div>
          <p className="text-xs text-white/50">Current streak</p>
          <p className="text-3xl font-semibold tabular-nums">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={streak} className="inline-block" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={spring.bouncy}>{streak}</motion.span>
            </AnimatePresence>{" "}days
          </p>
          <p className="text-xs text-white/50">{done.length}/{habits.length} habits done</p>
        </div>
      </div>
      <ul className="mt-5 space-y-2.5">
        {habits.map((h) => {
          const on = done.includes(h.id);
          return (
            <li key={h.id}>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => toggle(h.id)} aria-pressed={on} className={cn("relative flex w-full items-center gap-3 overflow-hidden rounded-2xl p-3.5 text-left transition-colors", on ? "bg-white/10" : "bg-white/5")}>
                <span className="grid size-10 place-items-center rounded-xl" style={{ background: `${h.color}26`, color: h.color }}><h.icon className="size-5" /></span>
                <span className={cn("flex-1 text-sm font-medium transition-opacity", on && "opacity-50 line-through")}>{h.label}</span>
                <span className="relative grid size-8 place-items-center">
                  <AnimatePresence>
                    {burst === h.id && Array.from({ length: 8 }, (_, n) => (
                      <motion.span key={n} className="absolute size-1.5 rounded-full" style={{ background: h.color }} initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: Math.cos((n / 8) * Math.PI * 2) * 22, y: Math.sin((n / 8) * Math.PI * 2) * 22, opacity: 0, scale: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />
                    ))}
                  </AnimatePresence>
                  <motion.span className="grid size-8 place-items-center rounded-full border-2" animate={{ backgroundColor: on ? h.color : "rgba(0,0,0,0)", borderColor: on ? h.color : "rgba(255,255,255,.25)", scale: on ? [1, 1.25, 1] : 1 }} transition={{ duration: 0.35 }}>
                    {on && <Check className="size-4 text-black" strokeWidth={3} />}
                  </motion.span>
                </span>
              </motion.button>
            </li>
          );
        })}
      </ul>
      <AnimatePresence>
        {all && (
          <motion.p className="mt-auto rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 p-3.5 text-center text-sm font-semibold text-black" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={spring.bouncy}>
            Perfect day! Streak extended 🔥
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
