"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface TextCubeRotateProps {
  words: string[];
  /** ms each word stays. */
  interval?: number;
  /** Letter stagger in seconds. */
  stagger?: number;
  className?: string;
}

/**
 * Rotating word where every letter is the face of a little cube: on each change the cubes tip
 * forward one after another, so the new word rolls in letter by letter from the top face while the
 * old one tips away underneath. Words of different lengths reflow smoothly. Reduced motion
 * cross-fades whole words.
 */
export function TextCubeRotate({ words, interval = 2200, stagger = 0.045, className }: TextCubeRotateProps) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [interval, words.length]);
  const word = words[i]!;
  const longest = Math.max(...words.map((w) => w.length));

  if (reduced)
    return (
      <span className={cn("relative inline-grid", className)} aria-live="polite">
        <AnimatePresence initial={false}>
          <motion.span key={word} className="col-start-1 row-start-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{word}</motion.span>
        </AnimatePresence>
      </span>
    );

  return (
    <span className={cn("relative inline-flex", className)} style={{ perspective: "8em" }} aria-label={word} aria-live="polite">
      {Array.from({ length: longest }, (_, k) => {
        const ch = word[k];
        return (
          <motion.span key={k} aria-hidden className="relative inline-grid" animate={{ width: ch ? "auto" : 0 }} transition={{ duration: 0.3, delay: k * stagger }} style={{ transformStyle: "preserve-3d" }}>
            <AnimatePresence initial={false}>
              {ch && (
                <motion.span
                  key={`${i}-${k}`}
                  className="col-start-1 row-start-1 inline-block whitespace-pre [backface-visibility:hidden]"
                  style={{ transformOrigin: "50% 50% -0.5em" }}
                  initial={{ rotateX: 90, opacity: 0 }}
                  animate={{ rotateX: 0, opacity: 1 }}
                  exit={{ rotateX: -90, opacity: 0 }}
                  transition={{ duration: 0.55, delay: k * stagger, ease: [0.65, 0, 0.35, 1] }}
                >
                  {ch}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.span>
        );
      })}
    </span>
  );
}
