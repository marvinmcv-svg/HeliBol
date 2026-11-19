"use client";
import { useId, useLayoutEffect, useRef, useState, type TextareaHTMLAttributes } from "react";
import { motion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export interface TextareaAutosizeProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onSubmit"> {
  label: string;
  maxLength?: number;
  /** Max visible rows before it scrolls. */
  maxRows?: number;
  /** Called on ⌘/Ctrl+Enter or the send button. */
  onSubmit?: (value: string) => void;
}

/**
 * A textarea that grows smoothly with its content (spring on height, measured from scrollHeight),
 * a character ring that fills and turns amber then red near the limit, and ⌘/Ctrl+Enter to send.
 */
export function TextareaAutosize({ label, maxLength = 280, maxRows = 8, onSubmit, className, ...rest }: TextareaAutosizeProps) {
  const reduced = useReducedMotion();
  const id = useId();
  const ref = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState(String(rest.defaultValue ?? ""));
  const [height, setHeight] = useState(48);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    const line = parseFloat(getComputedStyle(el).lineHeight) || 20;
    const next = Math.min(el.scrollHeight, line * maxRows + 24);
    el.style.height = "";
    setHeight(Math.max(48, next));
  }, [value, maxRows]);

  const left = maxLength - value.length;
  const pct = Math.min(1, value.length / maxLength);
  const color = left < 0 ? "#f43f5e" : left <= 20 ? "#f59e0b" : "var(--color-primary, #6366f1)";
  const send = () => {
    if (!value.trim() || left < 0) return;
    onSubmit?.(value);
    setValue("");
  };

  return (
    <div className={cn("w-full", className)}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <div className="rounded-2xl border border-border bg-background shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-ring">
        <motion.div animate={{ height }} transition={reduced ? { duration: 0 } : spring.snappy} className="overflow-hidden">
          <textarea
            {...rest}
            ref={ref}
            id={id}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) (e.preventDefault(), send());
              rest.onKeyDown?.(e);
            }}
            aria-describedby={`${id}-count`}
            className="block h-full w-full resize-none bg-transparent px-3.5 py-3 text-sm leading-5 outline-none placeholder:text-muted-foreground"
          />
        </motion.div>
        <div className="flex items-center justify-end gap-3 px-2.5 pb-2.5">
          <span id={`${id}-count`} className={cn("text-xs tabular-nums", left < 0 ? "text-rose-500" : "text-muted-foreground")} aria-live={left <= 20 ? "polite" : "off"}>
            {left <= 20 ? `${left} left` : `${value.length}/${maxLength}`}
          </span>
          <svg viewBox="0 0 20 20" className="size-5 -rotate-90" aria-hidden>
            <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-muted" />
            <motion.circle cx="10" cy="10" r="8" fill="none" strokeWidth="2.5" strokeLinecap="round" animate={{ pathLength: pct, stroke: color }} transition={reduced ? { duration: 0 } : spring.smooth} />
          </svg>
          <motion.button
            type="button"
            onClick={send}
            disabled={!value.trim() || left < 0}
            aria-label="Send (⌘/Ctrl+Enter)"
            whileTap={reduced ? undefined : { scale: 0.88 }}
            className="grid size-8 place-items-center rounded-full bg-foreground text-background transition-opacity disabled:opacity-30"
          >
            <ArrowUp className="size-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
