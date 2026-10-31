"use client";
import { useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@kinetik/core";
import { easeBezier } from "@kinetik/tokens";

/** Grid-lined hero lit by a cursor spotlight, with a gradient headline, social-proof avatars and dual CTAs. */
export function HeroSpotlightGrid({ avatars = [], className }: { avatars?: string[]; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const e = (d: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.7, ease: easeBezier.expoOut } });
  return (
    <section
      ref={ref}
      onPointerMove={(ev) => {
        if (ev.pointerType === "touch" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        ref.current.style.setProperty("--x", `${ev.clientX - r.left}px`);
        ref.current.style.setProperty("--y", `${ev.clientY - r.top}px`);
      }}
      className={cn("relative isolate flex flex-col items-center justify-center overflow-hidden px-6 text-center", className)}
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_75%)]" />
      <div aria-hidden className="absolute inset-0 -z-10 motion-reduce:hidden" style={{ background: "radial-gradient(500px circle at var(--x, 50%) var(--y, 30%), color-mix(in oklab, var(--color-brand, #8b5cf6) 22%, transparent), transparent 70%)" }} />
      <motion.div {...e(0)} className="flex items-center gap-2">
        <div className="flex -space-x-2">{avatars.slice(0, 5).map((a) => <img key={a} src={a} alt="" className="size-7 rounded-full border-2 border-background object-cover" />)}</div>
        <span className="text-xs text-muted-foreground">Loved by 12,000+ designers</span>
      </motion.div>
      <motion.h1 {...e(0.1)} className="mt-5 max-w-3xl bg-gradient-to-b from-foreground to-foreground/55 bg-clip-text text-5xl leading-[1.05] font-semibold tracking-tight text-transparent sm:text-6xl">The interface layer for ambitious teams</motion.h1>
      <motion.p {...e(0.2)} className="mt-4 max-w-lg text-muted-foreground">Design, animate and ship production UI with a shared motion language across web and mobile.</motion.p>
      <motion.div {...e(0.3)} className="mt-7 flex gap-3">
        <a href="#" className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background">Get started free</a>
        <a href="#" className="rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-medium">Book a demo</a>
      </motion.div>
    </section>
  );
}
