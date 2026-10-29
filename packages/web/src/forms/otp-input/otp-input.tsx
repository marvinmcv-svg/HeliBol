"use client";
import { useRef, useState } from "react";
import { motion, useAnimation } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface OtpInputProps {
  length?: number;
  /** Return true if the code is valid. */
  onComplete?: (code: string) => boolean | Promise<boolean>;
  className?: string;
}

export function OtpInput({ length = 6, onComplete, className }: OtpInputProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const input = useRef<HTMLInputElement>(null);
  const controls = useAnimation();
  const reduced = useReducedMotion();

  const update = async (v: string) => {
    const clean = v.replace(/\D/g, "").slice(0, length);
    setValue(clean);
    setStatus("idle");
    if (clean.length === length && onComplete) {
      const ok = await onComplete(clean);
      setStatus(ok ? "success" : "error");
      if (!ok) {
        if (!reduced) await controls.start({ x: [0, -10, 10, -7, 7, -3, 0], transition: { duration: 0.45 } });
        setTimeout(() => setValue(""), 300);
      }
    }
  };

  return (
    <motion.div animate={controls} className={cn("relative inline-flex gap-2", className)} onClick={() => input.current?.focus()}>
      <input
        ref={input}
        value={value}
        onChange={(e) => update(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={length}
        aria-label={`Verification code, ${length} digits`}
        aria-invalid={status === "error" || undefined}
        className="absolute inset-0 opacity-0"
      />
      {Array.from({ length }, (_, i) => {
        const char = value[i];
        const active = focused && (i === value.length || (i === length - 1 && value.length === length));
        return (
          <div
            key={i}
            aria-hidden
            className={cn(
              "relative grid size-12 place-items-center rounded-xl border bg-card text-xl font-semibold tabular-nums transition-[border-color,box-shadow,background-color] duration-200",
              active ? "border-brand ring-4 ring-brand/15" : "border-input",
              status === "error" && "border-destructive bg-destructive/5 text-destructive",
              status === "success" && "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            )}
          >
            {char && (
              <motion.span key={char + i} initial={{ y: 8, opacity: 0, scale: 0.6 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={spring.bouncy}>
                {char}
              </motion.span>
            )}
            {active && !char && <span className="h-6 w-0.5 animate-pulse rounded-full bg-foreground" />}
          </div>
        );
      })}
    </motion.div>
  );
}
