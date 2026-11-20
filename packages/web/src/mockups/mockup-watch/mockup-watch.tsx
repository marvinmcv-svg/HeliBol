"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface WatchApp { name: string; icon: ReactNode; color: string }
export interface MockupWatchProps {
  apps: WatchApp[];
  className?: string;
}

const ROW = 46;

/**
 * Smartwatch mockup with a working digital crown: turn the crown (drag it, use the mouse wheel over
 * the watch, or ↑/↓ when focused) and the app list scrolls on a curved, fish-eye path — rows near
 * the centre are big and bright, rows at the edges shrink and slide inward, like the real thing.
 * It snaps to the nearest row with a spring.
 */
export function MockupWatch({ apps, className }: MockupWatchProps) {
  const reduced = useReducedMotion();
  const y = useMotionValue(0); // index * ROW
  const crown = useTransform(y, (v) => v * 1.6);
  const [active, setActive] = useState(0);
  useMotionValueEvent(y, "change", (v) => setActive(Math.round(v / ROW)));
  const max = (apps.length - 1) * ROW;
  const snapTo = (v: number) => {
    const t = Math.max(0, Math.min(max, Math.round(v / ROW) * ROW));
    if (reduced) y.set(t);
    else animate(y, t, { type: "spring", stiffness: 300, damping: 30 });
  };
  const nudge = (d: number) => snapTo(y.get() + d * ROW);

  const face = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = face.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout>;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      y.set(Math.max(-ROW / 2, Math.min(max + ROW / 2, y.get() + e.deltaY * 0.35)));
      clearTimeout(t);
      t = setTimeout(() => snapTo(y.get()), 120);
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => (el.removeEventListener("wheel", wheel), clearTimeout(t));
  });

  const drag = useRef<number | null>(null);
  return (
    <div className={cn("relative select-none", className)}>
      {/* band */}
      <div aria-hidden className="absolute left-1/2 top-[-70px] h-[calc(100%+140px)] w-[150px] -translate-x-1/2 rounded-[40px] bg-gradient-to-b from-orange-400 via-orange-500 to-orange-400 opacity-90" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgb(0 0 0 / .06) 0 2px, transparent 2px 9px), linear-gradient(#fb923c,#f97316)" }} />
      {/* case */}
      <div className="relative h-[250px] w-[210px] rounded-[58px] bg-gradient-to-br from-zinc-500 via-zinc-800 to-zinc-600 p-[5px] shadow-[0_30px_60px_-20px_rgb(0_0_0/.6)]">
        <div
          ref={face}
          tabIndex={0}
          role="listbox"
          aria-label="Apps"
          aria-activedescendant={`watch-app-${active}`}
          onKeyDown={(e) => (e.key === "ArrowDown" ? (e.preventDefault(), nudge(1)) : e.key === "ArrowUp" ? (e.preventDefault(), nudge(-1)) : null)}
          className="relative h-full w-full overflow-hidden rounded-[53px] bg-black outline-none ring-orange-400 focus-visible:ring-2"
        >
          <p className="absolute right-7 top-4 z-10 font-mono text-sm font-semibold text-white">10:09</p>
          <div className="absolute inset-0 top-1/2">
            {apps.map((a, i) => <Row key={a.name} app={a} i={i} y={y} active={i === active} />)}
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_55%,#000_95%)]" />
        </div>
      </div>
      {/* crown */}
      <motion.button
        type="button"
        aria-label="Digital crown — drag to scroll"
        className="absolute right-[-13px] top-[62px] h-12 w-4 cursor-ns-resize touch-none rounded-r-md bg-gradient-to-r from-zinc-500 to-zinc-300"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,#52525b 0 1px,transparent 1px 3px)", backgroundPositionY: crown }}
        onPointerDown={(e) => ((drag.current = e.clientY - y.get() / 0.6), e.currentTarget.setPointerCapture(e.pointerId))}
        onPointerMove={(e) => drag.current !== null && y.set(Math.max(-ROW / 2, Math.min(max + ROW / 2, (drag.current - e.clientY) * -0.6)))}
        onPointerUp={() => ((drag.current = null), snapTo(y.get()))}
        onClick={() => face.current?.focus()}
      >
        <span className="absolute inset-y-1 right-0 w-1 rounded-r bg-orange-500" />
      </motion.button>
      <span aria-hidden className="absolute right-[-7px] top-[130px] h-14 w-2 rounded-r bg-zinc-600" />
    </div>
  );
}

function Row({ app, i, y, active }: { app: WatchApp; i: number; y: MotionValue<number>; active: boolean }) {
  const d = useTransform(y, (v) => (i * ROW - v) / ROW); // distance in rows from centre
  const ty = useTransform(d, (v) => v * ROW - 20 - Math.sign(v) * Math.max(0, Math.abs(v) - 1) * 6);
  const scale = useTransform(d, (v) => Math.max(0.45, 1 - Math.abs(v) * 0.17));
  const x = useTransform(d, (v) => Math.abs(v) * Math.abs(v) * 7);
  const opacity = useTransform(d, (v) => Math.max(0, 1 - Math.abs(v) * 0.3));
  return (
    <motion.div id={`watch-app-${i}`} role="option" aria-selected={active} className="absolute left-0 flex w-full items-center gap-3 px-6" style={{ y: ty, scale, x, opacity }}>
      <span className="grid size-10 shrink-0 place-items-center rounded-full text-white" style={{ background: app.color }}>{app.icon}</span>
      <span className="truncate text-base font-medium text-white">{app.name}</span>
    </motion.div>
  );
}
