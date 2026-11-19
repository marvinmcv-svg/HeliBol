"use client";
import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface ButtonDirectionalFillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** Fill colour (any CSS colour). */
  fill?: string;
  /** Text colour while filled. */
  fillText?: string;
}

/**
 * Hover fill that knows where you came from: a circle grows from the exact entry point and, on
 * leave, shrinks back toward the exit point. Pure CSS transitions driven by two custom properties.
 */
export function ButtonDirectionalFill({ children, className, fill = "currentColor", fillText = "var(--color-background, #fff)", style, ...rest }: ButtonDirectionalFillProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const setOrigin = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  return (
    <button
      ref={ref}
      {...rest}
      onPointerEnter={(e) => (setOrigin(e), rest.onPointerEnter?.(e))}
      onPointerLeave={(e) => (setOrigin(e), rest.onPointerLeave?.(e))}
      style={{ ...style, ["--fill" as string]: fill, ["--fill-text" as string]: fillText }}
      className={cn(
        "group/df relative isolate inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full border border-current px-7 text-sm font-semibold transition-colors duration-300 hover:text-[var(--fill-text)] focus-visible:text-[var(--fill-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute -z-10 size-2 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-[var(--fill)] group-hover/df:scale-[90] group-focus-visible/df:scale-[90]",
          reduced ? "transition-none" : "transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
        )}
        style={{ left: "var(--x, 50%)", top: "var(--y, 50%)" }}
      />
      {children}
    </button>
  );
}
