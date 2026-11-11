"use client";
import { useEffect, useState, type InputHTMLAttributes } from "react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface InputTypingPlaceholderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder"> {
  /** Example queries typed and erased in turn inside the empty field. */
  suggestions: string[];
  /** Static prefix shown before the typed text, e.g. "Try". */
  prefix?: string;
  typeSpeed?: number;
  pause?: number;
}

/**
 * An input whose placeholder types out example queries, pauses, and deletes them — like a person
 * demonstrating what to search. Stops as soon as the field has focus or a value. Reduced motion:
 * the suggestions rotate as whole words.
 */
export function InputTypingPlaceholder({ suggestions, prefix = "Try", typeSpeed = 55, pause = 1400, className, value, defaultValue, onFocus, onBlur, ...rest }: InputTypingPlaceholderProps) {
  const reduced = useReducedMotion();
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value ?? defaultValue));
  const idle = !focused && !hasValue && !value;

  useEffect(() => {
    if (!idle) return;
    let i = 0, n = 0, deleting = false, t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = suggestions[i];
      if (reduced) {
        setText(word);
        i = (i + 1) % suggestions.length;
        t = setTimeout(tick, pause + 800);
        return;
      }
      n += deleting ? -1 : 1;
      setText(word.slice(0, n));
      if (!deleting && n === word.length) { deleting = true; t = setTimeout(tick, pause); return; }
      if (deleting && n === 0) { deleting = false; i = (i + 1) % suggestions.length; t = setTimeout(tick, 300); return; }
      t = setTimeout(tick, deleting ? typeSpeed / 2 : typeSpeed + Math.random() * 40);
    };
    tick();
    return () => clearTimeout(t);
  }, [idle, suggestions, reduced, typeSpeed, pause]);

  return (
    <div className={cn("relative", className)}>
      <input
        {...rest}
        value={value}
        defaultValue={defaultValue}
        // a real placeholder for assistive tech; the animated one is decorative
        placeholder={`${prefix} “${suggestions[0]}”`}
        onFocus={(e) => (setFocused(true), onFocus?.(e))}
        onBlur={(e) => (setFocused(false), setHasValue(Boolean(e.currentTarget.value)), onBlur?.(e))}
        onInput={(e) => setHasValue(Boolean(e.currentTarget.value))}
        className="peer h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm shadow-sm outline-none transition-shadow placeholder:text-transparent focus-visible:ring-2 focus-visible:ring-ring"
      />
      {idle && (
        <span aria-hidden className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm text-muted-foreground">
          {prefix} “{text}
          <span className="ml-px inline-block h-4 w-px animate-pulse bg-current motion-reduce:animate-none" />”
        </span>
      )}
    </div>
  );
}
