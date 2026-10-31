"use client";
import { motion } from "motion/react";

const entries = [
  { v: "2.0", d: "Oct 31, 2026", t: "123 new components", b: "Heroes, AI interfaces, widgets, device mockups and REA-captured thumbnails.", tag: "Major" },
  { v: "1.4", d: "Oct 12, 2026", t: "Mobile flows", b: "Paywall, onboarding and checkout flows with Expo prompts.", tag: "Feature" },
  { v: "1.3", d: "Sep 28, 2026", t: "Reduced-motion toggle", b: "Preview every fallback from the docs header.", tag: "A11y" },
  { v: "1.0", d: "Sep 1, 2026", t: "Hello, world", b: "71 components, tokens and the registry.", tag: "Launch" },
];

/** Changelog timeline: a progress line draws down as entries enter, each version pops onto the rail. */
export function Changelog() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <h2 className="text-3xl font-semibold tracking-tight">Changelog</h2>
      <ol className="relative mt-10 space-y-10 pl-8">
        <motion.span aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-gradient-to-b from-brand to-border" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }} />
        {entries.map((e, i) => (
          <motion.li key={e.v} className="relative" initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <motion.span aria-hidden className="absolute top-1.5 -left-8 size-[15px] rounded-full border-2 border-brand bg-background" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.12 + 0.1, type: "spring", stiffness: 400, damping: 15 }} />
            <p className="flex items-center gap-2 text-xs text-muted-foreground"><span className="font-mono font-semibold text-foreground">v{e.v}</span>· {e.d}<span className="rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-semibold text-brand">{e.tag}</span></p>
            <h3 className="mt-1 text-lg font-semibold">{e.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{e.b}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
