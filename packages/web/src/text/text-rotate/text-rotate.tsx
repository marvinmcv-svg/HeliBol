"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";
import { durationS, easeBezier, spring } from "@kinetik/tokens";

export interface TextRotateProps {
  words: string[];
  /** ms each word is shown */
  interval?: number;
  className?: string;
  paused?: boolean;
}

export function TextRotate({ words, interval = 2200, className, paused }: TextRotateProps) {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval, paused]);

  return (
    <motion.span layout transition={spring.smooth} className={cn("relative inline-flex overflow-hidden align-bottom", className)}>
      <span className="sr-only">{words.join(", ")}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          aria-hidden
          className="inline-block whitespace-nowrap"
          initial={reduced ? { opacity: 0 } : { y: "100%", opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={reduced ? { opacity: 0 } : { y: "-100%", opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: durationS.slow, ease: easeBezier.expoOut }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
