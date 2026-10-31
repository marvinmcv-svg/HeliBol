"use client";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

/** Page transition: colored panels sweep up to cover the screen, the route swaps underneath with the page title, then they sweep away. */
export function TransitionCurtain({ pages, colors = ["#7c3aed", "#0ea5e9", "#f59e0b"], className }: { pages: { title: string; content: ReactNode }[]; colors?: string[]; className?: string }) {
  const [i, setI] = useState(0);
  const [cover, setCover] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const go = (n: number) => {
    if (n === i || cover) return;
    if (reduced) return setI(n);
    setCover(pages[n].title);
    setTimeout(() => setI(n), 650);
    setTimeout(() => setCover(null), 900);
  };
  return (
    <div className={cn("relative h-full overflow-hidden", className)}>
      <nav className="absolute top-3 left-1/2 z-20 flex -translate-x-1/2 gap-1 rounded-full border border-border bg-background/80 p-1 backdrop-blur">
        {pages.map((p, n) => <button key={p.title} onClick={() => go(n)} aria-current={i === n ? "page" : undefined} className={cn("rounded-full px-3 py-1 text-xs", i === n ? "bg-foreground text-background" : "text-muted-foreground")}>{p.title}</button>)}
      </nav>
      <div className="h-full">{pages[i].content}</div>
      <AnimatePresence>
        {cover &&
          colors.map((c, n) => (
            <motion.div key={c} className="absolute inset-0 z-30 grid place-items-center" style={{ background: c }} initial={{ y: "100%" }} animate={{ y: "0%", transition: { delay: n * 0.08, duration: 0.5, ease: [0.76, 0, 0.24, 1] } }} exit={{ y: "-100%", transition: { delay: (colors.length - 1 - n) * 0.06, duration: 0.5, ease: [0.76, 0, 0.24, 1] } }}>
              {n === colors.length - 1 && <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.35 } }} className="text-4xl font-semibold text-white">{cover}</motion.span>}
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}
