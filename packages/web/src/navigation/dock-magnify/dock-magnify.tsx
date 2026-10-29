"use client";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { cn, usePrefersTouch, useReducedMotion } from "@kinetik/core";

export interface DockItem {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
}

function DockIcon({ item, mouseX, base, max, distance }: { item: DockItem; mouseX: MotionValue<number>; base: number; max: number; distance: number }) {
  const ref = useRef<HTMLButtonElement>(null);
  const d = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect();
    return r ? x - r.left - r.width / 2 : Infinity;
  });
  const size = useSpring(useTransform(d, [-distance, 0, distance], [base, max, base]), { stiffness: 400, damping: 28, mass: 0.2 });
  return (
    <motion.button
      ref={ref}
      onClick={item.onClick}
      aria-label={item.label}
      style={{ width: size, height: size }}
      whileTap={{ scale: 0.9 }}
      className="group relative grid aspect-square place-items-center rounded-2xl bg-gradient-to-b from-zinc-100 to-zinc-300 text-zinc-800 shadow-md outline-none focus-visible:ring-2 focus-visible:ring-ring dark:from-zinc-700 dark:to-zinc-800 dark:text-zinc-100"
    >
      <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-foreground px-2 py-0.5 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{item.label}</span>
      <span className="grid size-1/2 place-items-center [&>svg]:size-full">{item.icon}</span>
    </motion.button>
  );
}

export function DockMagnify({ items, base = 44, max = 76, distance = 140, className }: { items: DockItem[]; base?: number; max?: number; distance?: number; className?: string }) {
  const mouseX = useMotionValue(Infinity);
  const off = useReducedMotion() || usePrefersTouch();
  return (
    <nav
      onPointerMove={(e) => !off && mouseX.set(e.clientX)}
      onPointerLeave={() => mouseX.set(Infinity)}
      className={cn("mx-auto flex h-[68px] items-end gap-3 rounded-3xl border border-border bg-background/60 px-3 pb-3 backdrop-blur-xl", className)}
    >
      {items.map((it) => <DockIcon key={it.label} item={it} mouseX={mouseX} base={base} max={off ? base : max} distance={distance} />)}
    </nav>
  );
}
