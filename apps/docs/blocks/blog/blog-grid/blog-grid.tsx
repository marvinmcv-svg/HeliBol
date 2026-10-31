"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AnimatedTabs } from "@web/layout/animated-tabs/animated-tabs";
import { CardHoverReveal } from "@web/cards/card-hover-reveal/card-hover-reveal";

const posts = [
  { t: "Why springs beat durations", c: "Engineering", i: 1 }, { t: "Designing for reduced motion", c: "Accessibility", i: 4 }, { t: "The anatomy of a great hover", c: "Design", i: 3 },
  { t: "Porting web motion to Expo", c: "Engineering", i: 7 }, { t: "Scroll-driven animations in 2026", c: "Engineering", i: 2 }, { t: "Color, contrast and glow", c: "Design", i: 6 },
];

export function BlogGrid() {
  const [cat, setCat] = useState("All");
  const shown = posts.filter((p) => cat === "All" || p.c === cat);
  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4"><h2 className="text-3xl font-semibold tracking-tight">Journal</h2><AnimatedTabs className="w-auto" onChange={setCat} tabs={["All", "Design", "Engineering", "Accessibility"].map((x) => ({ id: x, label: x }))} /></div>
      <motion.div layout className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <motion.div key={p.t} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: "spring", stiffness: 260, damping: 30 }}>
              <CardHoverReveal image={`/demo/photo-${p.i}.jpg`} title={p.t} subtitle={p.c} className="aspect-[4/5]">Read the full article — 6 min →</CardHoverReveal>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
