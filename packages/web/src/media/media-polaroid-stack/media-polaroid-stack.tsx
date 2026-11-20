"use client";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface Polaroid { src: string; caption: string; alt?: string }
export interface MediaPolaroidStackProps {
  photos: Polaroid[];
  className?: string;
}

const tilt = (i: number) => [-6, 4, -2, 7, -4, 3][i % 6]!;

/**
 * A messy pile of polaroids. Fling the top one in any direction and it flies off and slides back in
 * at the bottom of the pile; the others shuffle up with a new tilt. Hand-written captions. Buttons and
 * ←/→ do the same for keyboard users. Reduced motion just cycles without the throw.
 */
export function MediaPolaroidStack({ photos, className }: MediaPolaroidStackProps) {
  const reduced = useReducedMotion();
  const [order, setOrder] = useState(() => photos.map((_, i) => i));
  const [exitX, setExitX] = useState(400);
  const next = (dir = 1) => {
    setExitX(dir * 420);
    setOrder((o) => [...o.slice(1), o[0]!]);
  };
  const prev = () => setOrder((o) => [o[o.length - 1]!, ...o.slice(0, -1)]);
  const visible = order.slice(0, 4);

  return (
    <div
      className={cn("relative grid place-items-center", className)}
      tabIndex={0}
      role="group"
      aria-roledescription="photo stack"
      aria-label={`Photo ${order[0]! + 1} of ${photos.length}: ${photos[order[0]!]!.caption}`}
      onKeyDown={(e) => (e.key === "ArrowRight" ? next(1) : e.key === "ArrowLeft" ? prev() : null)}
    >
      <div className="relative h-[340px] w-[260px]">
        <AnimatePresence initial={false} custom={exitX}>
          {visible.slice().reverse().map((idx) => {
            const depth = visible.indexOf(idx);
            return depth === 0 ? (
              <TopCard key={idx} p={photos[idx]!} rot={tilt(idx)} reduced={reduced} onThrow={next} exitX={exitX} />
            ) : (
              <motion.div
                key={idx}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 - depth * 0.03, rotate: tilt(idx) * (1 + depth * 0.2), y: depth * 6, zIndex: 10 - depth }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
              >
                <Frame p={photos[idx]!} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <div className="mt-6 flex gap-2">
        <button type="button" onClick={prev} className="rounded-full border bg-background px-3 py-1 text-xs">← Back</button>
        <button type="button" onClick={() => next(1)} className="rounded-full border bg-background px-3 py-1 text-xs">Next →</button>
      </div>
    </div>
  );
}

function TopCard({ p, rot, reduced, onThrow, exitX }: { p: Polaroid; rot: number; reduced: boolean; onThrow: (dir: number) => void; exitX: number }) {
  const x = useMotionValue(0);
  const r = useTransform(x, [-300, 300], [rot - 18, rot + 18]);
  const end = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 600) onThrow(Math.sign(info.offset.x) || 1);
  };
  return (
    <motion.div
      className="absolute inset-0 z-20 cursor-grab touch-pan-y active:cursor-grabbing"
      style={{ x, rotate: reduced ? rot : r }}
      drag={reduced ? false : "x"}
      dragSnapToOrigin
      dragElastic={0.9}
      onDragEnd={end}
      initial={{ scale: 0.97, y: 6 }}
      animate={{ scale: 1, y: 0 }}
      exit={reduced ? { opacity: 0, transition: { duration: 0.15 } } : { x: exitX, y: 60, rotate: exitX > 0 ? 30 : -30, opacity: 0, transition: { duration: 0.45, ease: [0.3, 0, 0.2, 1] } }}
      whileTap={reduced ? undefined : { scale: 1.03 }}
    >
      <Frame p={p} />
    </motion.div>
  );
}

function Frame({ p }: { p: Polaroid }) {
  return (
    <figure className="h-full w-full select-none rounded-sm bg-[#fbfaf6] p-3 pb-0 shadow-[0_12px_30px_-8px_rgb(0_0_0/.35),0_2px_4px_rgb(0_0_0/.12)]">
      <img src={p.src} alt={p.alt ?? ""} draggable={false} className="aspect-square w-full object-cover saturate-[.9] sepia-[.12]" />
      <figcaption className="grid h-[64px] place-items-center text-center text-xl text-zinc-700" style={{ fontFamily: "'Segoe Print','Bradley Hand','Comic Sans MS',cursive" }}>{p.caption}</figcaption>
    </figure>
  );
}
