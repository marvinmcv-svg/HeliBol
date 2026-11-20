"use client";
import { useEffect, useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface InputPasswordPeekProps {
  label?: string;
  name?: string;
  autoComplete?: string;
  className?: string;
}

const GLYPHS = "!@#$%&*?§¤abcdefghijkmnpqrstuvwxyz0123456789";

/**
 * Password field with a character: an eye whose lid opens to reveal (letters scramble from dots
 * into the real characters left-to-right), closes to hide (they scramble back to dots), and whose
 * pupil follows the caret as you type. A real input underneath keeps autofill and managers working.
 */
export function InputPasswordPeek({ label = "Password", name = "password", autoComplete = "current-password", className }: InputPasswordPeekProps) {
  const reduced = useReducedMotion();
  const id = useId();
  const [value, setValue] = useState("");
  const [shown, setShown] = useState(false);
  const [display, setDisplay] = useState("");
  const raf = useRef(0);

  // scramble between masked and plain text
  useEffect(() => {
    cancelAnimationFrame(raf.current);
    const target = shown ? value : "•".repeat(value.length);
    if (reduced) return setDisplay(target);
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 350);
      const settled = Math.floor(p * target.length);
      setDisplay(target.split("").map((ch, i) => (i < settled ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join(""));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // only re-run on reveal toggle; typing updates below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, reduced]);
  useEffect(() => setDisplay(shown ? value : "•".repeat(value.length)), [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const look = Math.min(1, value.length / 18) * 2 - 1; // −1 … 1, pupil x
  return (
    <div className={cn("w-full max-w-xs space-y-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={shown ? "text" : "password"}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => setValue(e.target.value)}
          className="peer h-12 w-full rounded-2xl border border-border bg-background pl-4 pr-14 font-mono text-sm tracking-wider text-transparent caret-foreground outline-none selection:bg-primary/30 focus-visible:ring-2 focus-visible:ring-ring"
          spellCheck={false}
        />
        <span aria-hidden className="pointer-events-none absolute inset-y-0 left-4 right-14 flex items-center overflow-hidden whitespace-pre font-mono text-sm tracking-wider">
          {display}
        </span>
        <button
          type="button"
          onClick={() => setShown((s) => !s)}
          aria-pressed={shown}
          aria-label={shown ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
            <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
            <motion.g initial={false} animate={{ scaleY: shown ? 1 : 0.08 }} style={{ originX: 0.5, originY: 0.5 }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 22 }}>
              <circle cx="12" cy="12" r="3.3" />
              <motion.circle cy="12" r="1.3" fill="currentColor" stroke="none" animate={{ cx: 12 + look * 1.6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} />
            </motion.g>
            <motion.path d="M3 12c3 3.5 15 3.5 18 0" initial={false} animate={{ opacity: shown ? 0 : 1 }} transition={{ duration: 0.15 }} />
          </svg>
        </button>
      </div>
      <p className="text-xs text-muted-foreground" aria-live="polite">{shown ? "Password visible" : `${value.length} characters`}</p>
    </div>
  );
}
