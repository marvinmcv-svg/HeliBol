"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface TextFlipWordsProps {
  words: string[];
  interval?: number;
  className?: string;
}

/** Each letter of the next word flips down into place in 3D, staggered left-to-right. */
export function TextFlipWords({ words, interval = 2600, className }: TextFlipWordsProps) {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);
  const word = words[i];
  return (
    <span className={cn("relative inline-block [perspective:600px]", className)}>
      <span className="sr-only">{words.join(", ")}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={word} aria-hidden className="inline-block whitespace-nowrap" exit={{ opacity: 0, y: -16, filter: "blur(6px)", transition: { duration: 0.25 } }}>
          {Array.from(word).map((ch, n) => (
            <motion.span
              key={n}
              className="inline-block origin-top whitespace-pre [backface-visibility:hidden]"
              initial={reduced ? { opacity: 0 } : { rotateX: -100, opacity: 0, y: -6 }}
              animate={{ rotateX: 0, opacity: 1, y: 0 }}
              transition={{ delay: n * 0.04, type: "spring", stiffness: 300, damping: 22 }}
            >
              {ch}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
