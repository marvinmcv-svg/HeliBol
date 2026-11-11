"use client";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export interface TextSmartAnimateProps {
  /** Words or phrases to cycle through. */
  words: string[];
  /** Milliseconds each word stays. */
  interval?: number;
  className?: string;
}

/**
 * Figma "Smart Animate" for text: letters shared between the old and new word glide to their
 * new position (keyed by letter + occurrence), new letters blur in, leftovers blur out.
 */
export function TextSmartAnimate({ words, interval = 2200, className }: TextSmartAnimateProps) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);
  const word = words[i];

  // "banana" → b-0 a-0 n-0 a-1 n-1 a-2: the same key in two words = the same glyph moving.
  const letters = useMemo(() => {
    const seen: Record<string, number> = {};
    return [...word].map((ch) => {
      const k = ch.toLowerCase();
      seen[k] = (seen[k] ?? -1) + 1;
      return { ch, key: `${k}-${seen[k]}` };
    });
  }, [word]);

  return (
    <span className={cn("inline-flex whitespace-pre", className)} aria-live="polite">
      <span className="sr-only">{word}</span>
      <LayoutGroup>
        <span aria-hidden className="inline-flex">
          <AnimatePresence mode="popLayout" initial={false}>
            {letters.map((l) => (
              <motion.span
                key={l.key}
                layout={reduced ? false : "position"}
                initial={reduced ? { opacity: 0 } : { opacity: 0, filter: "blur(6px)", y: 8 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, filter: "blur(6px)", y: -8 }}
                transition={reduced ? { duration: 0.15 } : spring.smooth}
                className="inline-block"
              >
                {l.ch === " " ? " " : l.ch}
              </motion.span>
            ))}
          </AnimatePresence>
        </span>
      </LayoutGroup>
    </span>
  );
}
