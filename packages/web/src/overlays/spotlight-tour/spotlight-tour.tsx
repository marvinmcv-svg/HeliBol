"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface TourStep {
  /** CSS selector inside the tour root. */
  target: string;
  title: string;
  body: string;
}

export interface SpotlightTourProps {
  steps: TourStep[];
  /** Element the tour lives in (the overlay covers it). */
  root: RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  className?: string;
}

type Box = { x: number; y: number; w: number; h: number };

/**
 * Product tour: a dimmed overlay with a rounded cut-out that glides (spring) from one target to the
 * next, a pulse ring around the target, and a tooltip card that flips above/below to stay in view.
 * Arrow keys / Enter step through, Esc ends. Focus moves to the card each step.
 */
export function SpotlightTour({ steps, root, open, onClose, className }: SpotlightTourProps) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [box, setBox] = useState<Box | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const card = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, "");
  const step = steps[i];

  useLayoutEffect(() => {
    if (!open) return;
    const r = root.current;
    const measure = () => {
      const t = r?.querySelector(step.target);
      if (!r || !t) return;
      const rr = r.getBoundingClientRect(), tr = t.getBoundingClientRect();
      setSize({ w: rr.width, h: rr.height });
      setBox({ x: tr.left - rr.left - 8, y: tr.top - rr.top - 8, w: tr.width + 16, h: tr.height + 16 });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open, step, root]);

  useEffect(() => {
    if (!open) return setI(0);
    card.current?.focus();
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === "Enter") (e.preventDefault(), i < steps.length - 1 ? setI(i + 1) : onClose());
      if (e.key === "ArrowLeft") setI((n) => Math.max(0, n - 1));
    };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open, i, steps.length, onClose]);

  const below = box ? box.y + box.h + 170 < size.h : true;
  const cardX = box ? Math.min(Math.max(12, box.x + box.w / 2 - 140), size.w - 292) : 0;
  const t = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 260, damping: 30 };

  return (
    <AnimatePresence>
      {open && box && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={cn("absolute inset-0 z-50", className)}>
          <svg className="absolute inset-0 size-full" aria-hidden>
            <defs>
              <mask id={`kn-tour-${uid}`}>
                <rect width="100%" height="100%" fill="white" />
                <motion.rect animate={{ x: box.x, y: box.y, width: box.w, height: box.h }} transition={t} rx="14" fill="black" />
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="rgb(0 0 0 / .62)" mask={`url(#kn-tour-${uid})`} onClick={onClose} />
          </svg>
          <motion.span aria-hidden className="pointer-events-none absolute rounded-[14px] ring-2 ring-white/80" animate={{ left: box.x, top: box.y, width: box.w, height: box.h }} transition={t}>
            {!reduced && <span className="absolute inset-0 animate-ping rounded-[14px] ring-2 ring-white/40" />}
          </motion.span>
          <motion.div
            ref={card}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`kn-tour-t-${uid}`}
            tabIndex={-1}
            animate={{ left: cardX, top: below ? box.y + box.h + 12 : box.y - 12 - 150 }}
            transition={t}
            className="absolute w-[280px] rounded-2xl bg-popover p-4 text-popover-foreground shadow-2xl outline-none"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={i} initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                <p className="text-[11px] font-medium text-muted-foreground">Step {i + 1} of {steps.length}</p>
                <h2 id={`kn-tour-t-${uid}`} className="mt-0.5 font-semibold">{step.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-1">{steps.map((_, n) => <motion.span key={n} animate={{ width: n === i ? 16 : 6 }} className={cn("h-1.5 rounded-full", n === i ? "bg-primary" : "bg-muted")} />)}</div>
              <div className="flex gap-2 text-sm">
                <button type="button" onClick={onClose} className="px-2 text-muted-foreground hover:text-foreground">Skip</button>
                <button type="button" onClick={() => (i < steps.length - 1 ? setI(i + 1) : onClose())} className="rounded-lg bg-foreground px-3 py-1.5 font-medium text-background">{i < steps.length - 1 ? "Next" : "Done"}</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
