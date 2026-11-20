"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface ButtonLikeCounterProps {
  count: number;
  defaultLiked?: boolean;
  onChange?: (liked: boolean) => void;
  className?: string;
}

const fmt = (n: number) => (n >= 10000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k` : n.toLocaleString());

/**
 * Like button with the full ceremony: the heart squashes, then bursts — a ring expands and
 * confetti dots fly out on a spiral — and the counter rolls digit by digit (only the digits that
 * change move, up for a like, down for an unlike).
 */
export function ButtonLikeCounter({ count, defaultLiked = false, onChange, className }: ButtonLikeCounterProps) {
  const reduced = useReducedMotion();
  const [liked, setLiked] = useState(defaultLiked);
  const [burst, setBurst] = useState(0);
  const n = count + (liked ? 1 : 0);
  const toggle = () => {
    const next = !liked;
    setLiked(next);
    if (next) setBurst((b) => b + 1);
    onChange?.(next);
  };
  const dir = liked ? 1 : -1;
  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={`${liked ? "Unlike" : "Like"}, ${n.toLocaleString()} likes`}
      onClick={toggle}
      className={cn("group inline-flex h-11 items-center gap-2 rounded-full border bg-card pl-2.5 pr-4 text-sm font-medium transition-colors", liked ? "border-rose-500/30 text-rose-500" : "text-muted-foreground hover:text-foreground", className)}
    >
      <span className="relative grid size-7 place-items-center">
        {!reduced && burst > 0 && liked && (
          <span key={burst} aria-hidden className="pointer-events-none absolute inset-0">
            <motion.span className="absolute inset-0 rounded-full border-2 border-rose-500" initial={{ scale: 0.3, opacity: 1 }} animate={{ scale: 1.8, opacity: 0, borderWidth: 0 }} transition={{ duration: 0.5 }} />
            {Array.from({ length: 10 }, (_, i) => {
              const a = (i / 10) * Math.PI * 2;
              return (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-1/2 size-1.5 rounded-full"
                  style={{ background: ["#f43f5e", "#f59e0b", "#8b5cf6", "#22d3ee", "#22c55e"][i % 5], marginLeft: -3, marginTop: -3 }}
                  initial={{ x: 0, y: 0, scale: 1 }}
                  animate={{ x: Math.cos(a + 0.4) * 22, y: Math.sin(a + 0.4) * 22, scale: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
                />
              );
            })}
          </span>
        )}
        <motion.svg viewBox="0 0 24 24" className="size-6" animate={reduced ? {} : liked ? { scale: [1, 0.6, 1.25, 1] } : { scale: [1, 0.85, 1] }} transition={{ duration: 0.45 }} key={String(liked)}>
          <path d="M12 20.5s-7.5-4.6-7.5-10.3A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.6c0 5.7-7.5 10.3-7.5 10.3z" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </motion.svg>
      </span>
      <span aria-hidden className="inline-flex overflow-hidden font-mono tabular-nums">
        {[...fmt(n)].map((ch, i, arr) => (
          <span key={arr.length - i} className="relative inline-grid h-5 overflow-hidden">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span key={ch} className="col-start-1 row-start-1" initial={{ y: reduced ? 0 : 18 * dir, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: reduced ? 0 : -18 * dir, opacity: 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}>
                {ch}
              </motion.span>
            </AnimatePresence>
          </span>
        ))}
      </span>
    </button>
  );
}
