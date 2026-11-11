"use client";
import { useId, useRef, type ReactNode } from "react";
import { motion } from "motion/react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export interface RadioCardOption {
  value: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  /** Right-aligned extra, e.g. a price. */
  aside?: ReactNode;
}

export interface RadioCardsProps {
  options: RadioCardOption[];
  value: string;
  onChange: (v: string) => void;
  label: string;
  className?: string;
}

/**
 * Selectable cards backed by native radio inputs (so arrow keys, forms and screen readers just work).
 * A highlight ring glides between cards with shared layout and the dot springs in.
 */
export function RadioCards({ options, value, onChange, label, className }: RadioCardsProps) {
  const reduced = useReducedMotion();
  const name = useId();
  const ref = useRef<HTMLFieldSetElement>(null);
  return (
    <fieldset ref={ref} className={cn("grid gap-2", className)}>
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <label key={o.value} className={cn("relative flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring", on ? "border-transparent" : "border-border hover:bg-muted/50")}>
            <input type="radio" name={name} value={o.value} checked={on} onChange={() => onChange(o.value)} className="sr-only" />
            {on && <motion.span layoutId={`${name}-ring`} transition={reduced ? { duration: 0 } : spring.smooth} className="absolute inset-0 rounded-2xl bg-primary/5 ring-2 ring-primary" />}
            <span className={cn("relative grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors", on ? "border-primary" : "border-border")}>
              <motion.span initial={false} animate={{ scale: on ? 1 : 0 }} transition={reduced ? { duration: 0 } : spring.bouncy} className="size-2.5 rounded-full bg-primary" />
            </span>
            {o.icon && <span className="relative text-muted-foreground">{o.icon}</span>}
            <span className="relative min-w-0 flex-1">
              <span className="block text-sm font-medium">{o.title}</span>
              {o.description && <span className="block text-xs text-muted-foreground">{o.description}</span>}
            </span>
            {o.aside && <span className="relative text-sm font-semibold tabular-nums">{o.aside}</span>}
          </label>
        );
      })}
    </fieldset>
  );
}
