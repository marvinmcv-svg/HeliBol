"use client";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export type Weather = "sunny" | "cloudy" | "rainy" | "night";

const themes: Record<Weather, string> = {
  sunny: "from-sky-400 to-blue-600",
  cloudy: "from-slate-400 to-slate-600",
  rainy: "from-slate-600 to-indigo-900",
  night: "from-indigo-950 to-slate-900",
};

function Scene({ w, reduced }: { w: Weather; reduced: boolean }) {
  const loop = (d: number) => (reduced ? { duration: 0 } : { duration: d, repeat: Infinity, ease: "linear" as const });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {w === "sunny" && (
        <motion.div className="absolute -top-8 -right-8 size-32" animate={{ rotate: 360 }} transition={loop(30)}>
          {Array.from({ length: 12 }, (_, i) => <span key={i} className="absolute top-1/2 left-1/2 h-1 w-14 origin-left rounded-full bg-yellow-200/60" style={{ rotate: `${i * 30}deg` }} />)}
          <span className="absolute inset-7 rounded-full bg-yellow-300 shadow-[0_0_40px_#fde047]" />
        </motion.div>
      )}
      {(w === "cloudy" || w === "rainy") &&
        [0, 1].map((i) => (
          <motion.div key={i} className="absolute h-10 w-24 rounded-full bg-white/70 blur-[1px]" style={{ top: 18 + i * 22 }} initial={{ x: i ? -120 : 40 }} animate={{ x: [i ? -120 : 40, 260] }} transition={loop(i ? 18 : 24)}>
            <span className="absolute -top-4 left-5 size-10 rounded-full bg-white/70" />
          </motion.div>
        ))}
      {w === "rainy" &&
        Array.from({ length: 18 }, (_, i) => (
          <motion.span key={i} className="absolute top-0 h-4 w-px bg-sky-200/70" style={{ left: `${(i * 37) % 100}%` }} animate={{ y: [-20, 220] }} transition={reduced ? { duration: 0 } : { duration: 0.8 + (i % 4) * 0.15, repeat: Infinity, delay: (i % 6) * 0.13, ease: "linear" }} />
        ))}
      {w === "night" &&
        Array.from({ length: 14 }, (_, i) => (
          <motion.span key={i} className="absolute size-0.5 rounded-full bg-white" style={{ left: `${(i * 41) % 100}%`, top: `${(i * 23) % 60}%` }} animate={{ opacity: [0.2, 1, 0.2] }} transition={reduced ? { duration: 0 } : { duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.2 }} />
        ))}
    </div>
  );
}

/** Weather widget whose sky, scene (rays, drifting clouds, rain, twinkling stars) and gradient crossfade per condition. */
export function WidgetWeather({ weather, city, temp, hi, lo, className }: { weather: Weather; city: string; temp: number; hi: number; lo: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <div className={cn("relative h-44 w-64 overflow-hidden rounded-3xl text-white shadow-xl", className)} role="group" aria-label={`${city}: ${temp}°, ${weather}`}>
      <AnimatePresence initial={false}>
        <motion.div key={weather} className={cn("absolute inset-0 bg-gradient-to-br", themes[weather])} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
          <Scene w={weather} reduced={reduced} />
        </motion.div>
      </AnimatePresence>
      <div className="relative flex h-full flex-col justify-between p-4">
        <div><p className="text-sm font-medium">{city}</p><p className="text-5xl font-light tabular-nums">{temp}°</p></div>
        <div className="text-xs"><p className="capitalize">{weather}</p><p className="opacity-80">H:{hi}° L:{lo}°</p></div>
      </div>
    </div>
  );
}
