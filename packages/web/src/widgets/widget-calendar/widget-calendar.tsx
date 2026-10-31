"use client";
import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

/** Mini month calendar: the selected-day pill glides between dates, months slide in their travel direction, event dots below days. */
export function WidgetCalendar({ events = {}, className }: { events?: Record<string, string>; className?: string }) {
  const [cursor, setCursor] = useState(() => new Date(2026, 9, 1));
  const [dir, setDir] = useState(1);
  const [sel, setSel] = useState<string>("2026-10-29");
  const pill = useId();
  const y = cursor.getFullYear();
  const m = cursor.getMonth();
  const first = (new Date(y, m, 1).getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const key = (d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const go = (d: number) => (setDir(d), setCursor(new Date(y, m + d, 1)));
  return (
    <div className={cn("w-72 rounded-3xl border border-border bg-card p-4", className)}>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-semibold">{cursor.toLocaleString("en", { month: "long", year: "numeric" })}</p>
        <div className="flex gap-1">
          <button onClick={() => go(-1)} aria-label="Previous month" className="grid size-7 place-items-center rounded-full hover:bg-accent"><ChevronLeft className="size-4" /></button>
          <button onClick={() => go(1)} aria-label="Next month" className="grid size-7 place-items-center rounded-full hover:bg-accent"><ChevronRight className="size-4" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center text-[11px] text-muted-foreground">{["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}</div>
      <div className="relative mt-1 h-[13.5rem] overflow-hidden">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div key={`${y}-${m}`} custom={dir} variants={{ in: (d: number) => ({ x: d * 60, opacity: 0 }), c: { x: 0, opacity: 1 }, out: (d: number) => ({ x: d * -60, opacity: 0 }) }} initial="in" animate="c" exit="out" transition={spring.smooth} className="grid grid-cols-7 gap-y-1" role="grid">
            {Array.from({ length: first }, (_, i) => <span key={`e${i}`} />)}
            {Array.from({ length: days }, (_, i) => {
              const d = i + 1;
              const k = key(d);
              const on = k === sel;
              return (
                <button key={k} onClick={() => setSel(k)} aria-pressed={on} aria-label={`${k}${events[k] ? `, ${events[k]}` : ""}`} className={cn("relative mx-auto grid size-8 place-items-center rounded-full text-sm", on ? "text-background" : "hover:bg-accent")}>
                  {on && <motion.span layoutId={pill} transition={spring.snappy} className="absolute inset-0 rounded-full bg-foreground" />}
                  <span className="relative">{d}</span>
                  {events[k] && <span className={cn("absolute bottom-0.5 size-1 rounded-full", on ? "bg-background" : "bg-orange-500")} />}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={sel} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1 truncate rounded-xl bg-muted px-3 py-2 text-xs">{events[sel] ? `● ${events[sel]}` : "No events"}</motion.p>
      </AnimatePresence>
    </div>
  );
}
