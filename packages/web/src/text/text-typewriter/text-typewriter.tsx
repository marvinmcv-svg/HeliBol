"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface TextTypewriterProps {
  words: string[];
  /** ms per typed character */
  typeSpeed?: number;
  deleteSpeed?: number;
  /** ms to hold a finished word */
  pause?: number;
  loop?: boolean;
  className?: string;
  caretClassName?: string;
}

export function TextTypewriter({
  words,
  typeSpeed = 70,
  deleteSpeed = 35,
  pause = 1400,
  loop = true,
  className,
  caretClassName,
}: TextTypewriterProps) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length] ?? "";
    if (reduced) {
      setText(word);
      const t = setTimeout(() => (loop || index < words.length - 1) && setIndex((i) => (i + 1) % words.length), pause * 1.5);
      return () => clearTimeout(t);
    }
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && text === word) {
      if (!loop && index === words.length - 1) return;
      t = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
    } else {
      t = setTimeout(
        () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
        deleting ? deleteSpeed : typeSpeed,
      );
    }
    return () => clearTimeout(t);
  }, [text, deleting, index, words, reduced, loop, pause, typeSpeed, deleteSpeed]);

  return (
    <span className={cn("inline-flex items-baseline", className)}>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden className="whitespace-pre">{text}</span>
      <motion.span
        aria-hidden
        className={cn("ml-0.5 inline-block w-[2px] self-stretch bg-current", caretClassName)}
        animate={reduced ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
      />
    </span>
  );
}
