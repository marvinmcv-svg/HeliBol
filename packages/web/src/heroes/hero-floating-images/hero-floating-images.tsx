"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn, usePrefersTouch, useReducedMotion } from "@kinetik/core";

const spots = [
  { l: "6%", t: "10%", w: 150, d: 0.6, r: -8 },
  { l: "74%", t: "6%", w: 170, d: 1, r: 6 },
  { l: "2%", t: "62%", w: 120, d: 1.4, r: 5 },
  { l: "80%", t: "58%", w: 140, d: 0.8, r: -6 },
  { l: "38%", t: "78%", w: 100, d: 1.8, r: 3 },
  { l: "56%", t: "2%", w: 90, d: 2.2, r: -4 },
];

/** Headline surrounded by photos floating at different depths that parallax against the pointer. */
export function HeroFloatingImages({ images, title = "Collect moments, not things.", className }: { images: string[]; title?: string; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const off = useReducedMotion() || usePrefersTouch();
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });
  return (
    <section
      ref={ref}
      onPointerMove={(e) => {
        if (off || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      className={cn("relative grid place-items-center overflow-hidden px-6", className)}
    >
      {spots.map((s, i) => (
        <Floating key={i} src={images[i % images.length]} spot={s} mx={mx} my={my} i={i} />
      ))}
      <div className="relative z-10 text-center">
        <h1 className="max-w-xl text-5xl font-semibold tracking-tight sm:text-6xl">{title}</h1>
        <p className="mt-3 text-muted-foreground">A gallery that breathes with your cursor.</p>
      </div>
    </section>
  );
}

function Floating({ src, spot, mx, my, i }: { src: string; spot: (typeof spots)[number]; mx: ReturnType<typeof useSpring>; my: ReturnType<typeof useSpring>; i: number }) {
  const x = useTransform(mx, (v) => v * -60 * spot.d);
  const y = useTransform(my, (v) => v * -60 * spot.d);
  return (
    <motion.img
      src={src}
      alt=""
      aria-hidden
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 + i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ left: spot.l, top: spot.t, width: spot.w, x, y, rotate: spot.r }}
      className="absolute aspect-[4/5] rounded-2xl object-cover shadow-2xl"
    />
  );
}
