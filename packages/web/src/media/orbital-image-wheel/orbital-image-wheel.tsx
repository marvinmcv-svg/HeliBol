"use client";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface OrbitalImageWheelProps {
  items: { image: string; title: string }[];
  /** Wheel radius as a fraction of the container width. */
  radius?: number;
  className?: string;
}

function Spoke({ i, n, angle, radius, image, title, active, onSelect }: { i: number; n: number; angle: MotionValue<number>; radius: number; image: string; title: string; active: boolean; onSelect: () => void }) {
  const base = (i / n) * 360;
  // Position on the wheel and scale by closeness to the top (the "selected" slot).
  const rot = useTransform(angle, (a) => base + a);
  const x = useTransform(rot, (r) => Math.sin((r * Math.PI) / 180) * radius);
  const y = useTransform(rot, (r) => -Math.cos((r * Math.PI) / 180) * radius);
  const near = useTransform(rot, (r) => {
    const d = Math.abs(((((r % 360) + 540) % 360) - 180));
    return 1 - Math.min(1, d / 60);
  });
  const scale = useTransform(near, [0, 1], [0.62, 1.15]);
  const opacity = useTransform(near, [0, 1], [0.45, 1]);
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-label={title}
      aria-current={active || undefined}
      style={{ x, y, scale, opacity, rotate: rot }}
      className="absolute left-1/2 top-1/2 -ml-[44px] -mt-[58px] h-[116px] w-[88px] overflow-hidden rounded-2xl shadow-xl outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
    >
      <img src={image} alt="" draggable={false} className="size-full object-cover" />
    </motion.button>
  );
}

/**
 * Images arranged on a big wheel whose hub sits below the frame. Drag, scroll or use the arrow keys
 * to turn it; it snaps so one image sits at the top, enlarged, with its title.
 */
export function OrbitalImageWheel({ items, radius = 0.55, className }: OrbitalImageWheelProps) {
  const reduced = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(600);
  const angle = useMotionValue(0);
  const [active, setActive] = useState(0);
  const n = items.length;
  const step = 360 / n;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const goTo = (idx: number) => {
    const target = -idx * step;
    // shortest way round from the current angle
    const cur = angle.get();
    const delta = ((((target - cur) % 360) + 540) % 360) - 180;
    const dest = cur + delta;
    setActive(((idx % n) + n) % n);
    if (reduced) angle.set(dest);
    else animate(angle, dest, { type: "spring", stiffness: 140, damping: 22 });
  };
  const snap = () => goTo(Math.round(-angle.get() / step));

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout>;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      angle.set(angle.get() - (e.deltaY + e.deltaX) * 0.08);
      clearTimeout(t);
      t = setTimeout(snap, 140);
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  });

  const R = w * radius;
  return (
    <div
      ref={box}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image wheel"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") goTo(active + 1);
        if (e.key === "ArrowLeft") goTo(active - 1);
      }}
      className={cn("relative h-full w-full touch-pan-y overflow-hidden outline-none", className)}
    >
      <motion.div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onPan={(_, info) => angle.set(angle.get() + info.delta.x * (180 / (Math.PI * R)))}
        onPanEnd={snap}
        style={{ top: R * 0.9 }}
      >
        {items.map((it, i) => (
          <Spoke key={i} i={i} n={n} angle={angle} radius={R} image={it.image} title={it.title} active={i === active} onSelect={() => goTo(i)} />
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-6 text-center" aria-live="polite">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</p>
        <motion.p key={active} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-xl font-semibold tracking-tight">{items[active].title}</motion.p>
      </div>
    </div>
  );
}
