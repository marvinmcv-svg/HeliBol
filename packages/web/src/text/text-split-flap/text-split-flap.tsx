"use client";
import { useEffect, useState } from "react";
import { cn, useReducedMotion } from "@kinetik/core";

const CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:-.";

export interface TextSplitFlapProps {
  value: string;
  /** ms per flap step */
  speed?: number;
  className?: string;
  cellClassName?: string;
}

/** Airport departure board: every cell flaps through the alphabet until it lands on its target. */
export function TextSplitFlap({ value, speed = 45, className, cellClassName }: TextSplitFlapProps) {
  const target = value.toUpperCase();
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(() => target.replace(/./g, " "));

  useEffect(() => {
    if (reduced) {
      setShown(target);
      return;
    }
    const id = setInterval(() => {
      setShown((cur) => {
        const padded = cur.padEnd(target.length, " ").slice(0, target.length);
        let done = true;
        const next = Array.from(padded)
          .map((c, i) => {
            const t = target[i];
            if (c === t) return c;
            done = false;
            const ni = (CHARS.indexOf(c) + 1) % CHARS.length;
            return CHARS[ni] ?? t;
          })
          .join("");
        if (done) clearInterval(id);
        return next;
      });
    }, speed);
    return () => clearInterval(id);
  }, [target, speed, reduced]);

  return (
    <span className={cn("inline-flex gap-1 font-mono", className)} aria-label={value} role="text">
      {Array.from(shown).map((c, i) => (
        <span key={i} aria-hidden className={cn("relative grid h-[1.6em] w-[1.15em] place-items-center overflow-hidden rounded-[0.18em] bg-zinc-900 text-amber-300 shadow-[inset_0_-1px_0_rgb(255_255_255/.06)]", cellClassName)}>
          {c}
          <span className="absolute inset-x-0 top-1/2 h-px bg-black/70" />
        </span>
      ))}
    </span>
  );
}
