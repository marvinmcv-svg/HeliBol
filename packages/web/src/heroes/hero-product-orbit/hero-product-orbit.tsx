"use client";
import { useEffect, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, animate, type MotionValue } from "motion/react";
import { cn, usePrefersTouch, useReducedMotion } from "@kinetik/core";

export interface OrbitChip {
  icon: ReactNode;
  label: string;
}

export interface HeroProductOrbitProps {
  /** The product visual in the centre (an app card, device, logo…). */
  product: ReactNode;
  chips: OrbitChip[];
  children?: ReactNode;
  className?: string;
}

/**
 * Product hero with feature chips riding a tilted 3D ellipse around the product: chips in front are
 * larger and sharp, chips behind shrink, blur and pass behind the product (z-index by depth). The
 * whole orbit tilts toward the pointer; hovering a chip pauses the orbit.
 */
export function HeroProductOrbit({ product, chips, children, className }: HeroProductOrbitProps) {
  const reduced = useReducedMotion();
  const touch = usePrefersTouch();
  const angle = useMotionValue(0);
  const [paused, setPaused] = useState(false);
  const tiltX = useSpring(useMotionValue(62), { stiffness: 80, damping: 18 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 80, damping: 18 });

  useEffect(() => {
    if (reduced || paused) return;
    const ctl = animate(angle, angle.get() + 360, { duration: 26, ease: "linear", repeat: Infinity });
    return () => ctl.stop();
  }, [reduced, paused, angle]);

  return (
    <section
      className={cn("relative isolate grid h-full min-h-[480px] place-items-center overflow-hidden", className)}
      onPointerMove={(e) => {
        if (touch || reduced) return;
        const r = e.currentTarget.getBoundingClientRect();
        tiltX.set(62 + ((e.clientY - r.top) / r.height - 0.5) * -14);
        tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 16);
      }}
    >
      {children && <div className="absolute inset-x-0 top-8 z-30 px-6 text-center">{children}</div>}
      <div className="relative mt-16 size-[min(78vw,420px)]" style={{ perspective: 1000 }}>
        <div className="absolute inset-0 z-[5] grid place-items-center">{product}</div>
        {chips.map((c, i) => (
          <Chip key={c.label} i={i} n={chips.length} chip={c} angle={angle} tiltX={tiltX} tiltY={tiltY} onHover={setPaused} />
        ))}
      </div>
    </section>
  );
}

function Chip({ i, n, chip, angle, tiltX, tiltY, onHover }: { i: number; n: number; chip: OrbitChip; angle: MotionValue<number>; tiltX: MotionValue<number>; tiltY: MotionValue<number>; onHover: (b: boolean) => void }) {
  const base = (i / n) * 360;
  // project a point on a circle tilted by tiltX around the x-axis (and nudged by tiltY)
  const pos = useTransform([angle, tiltX, tiltY], ([a, tx, ty]: number[]) => {
    const t = ((a + base) * Math.PI) / 180;
    const R = 46; // % of container
    const x = Math.cos(t) * R + ty * 0.2 * Math.sin(t);
    const zRaw = Math.sin(t);
    const y = zRaw * R * Math.cos((tx * Math.PI) / 180);
    return { x, y, z: zRaw };
  });
  const left = useTransform(pos, (p) => `${50 + p.x}%`);
  const top = useTransform(pos, (p) => `${50 + p.y}%`);
  const scale = useTransform(pos, (p) => 0.75 + (p.z + 1) * 0.2);
  const filter = useTransform(pos, (p) => `blur(${Math.max(0, -p.z) * 2.5}px)`);
  const opacity = useTransform(pos, (p) => 0.55 + (p.z + 1) * 0.225);
  const zIndex = useTransform(pos, (p) => (p.z > 0 ? 10 : 1));
  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left, top, scale, filter, opacity, zIndex }}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
    >
      <span className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur">
        <span aria-hidden className="grid size-5 place-items-center">{chip.icon}</span>
        {chip.label}
      </span>
    </motion.div>
  );
}
