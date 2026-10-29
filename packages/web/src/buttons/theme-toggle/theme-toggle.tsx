"use client";
import { useEffect, useId, useState } from "react";
import { flushSync } from "react-dom";
import { motion } from "motion/react";
import { cn, prefersReducedMotion } from "@kinetik/core";
import { duration, ease, spring } from "@kinetik/tokens";

export type Theme = "light" | "dark";

export interface ThemeToggleProps {
  /** Controlled theme. When omitted the toggle manages `.dark` on <html> and localStorage("theme"). */
  theme?: Theme;
  onThemeChange?: (theme: Theme) => void;
  /** Circle-reveal the new theme from the button using the View Transitions API. */
  reveal?: boolean;
  className?: string;
}

function applyTheme(t: Theme) {
  document.documentElement.classList.toggle("dark", t === "dark");
  try {
    localStorage.setItem("theme", t);
  } catch {}
}

export function ThemeToggle({ theme: controlled, onThemeChange, reveal = true, className }: ThemeToggleProps) {
  const [internal, setInternal] = useState<Theme>("dark");
  const theme = controlled ?? internal;

  useEffect(() => {
    if (!controlled) setInternal(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, [controlled]);

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const commit = () => {
      if (!controlled) {
        setInternal(next);
        applyTheme(next);
      }
      onThemeChange?.(next);
    };
    if (!reveal || !document.startViewTransition || prefersReducedMotion()) return commit();

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = document.startViewTransition(() => flushSync(commit));
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: duration.slower, easing: ease.expoOut, pseudoElement: "::view-transition-new(root)" },
      );
    });
  };

  const dark = theme === "dark";
  const maskId = `k-moon-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn("relative grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground", className)}
    >
      <motion.svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" animate={{ rotate: dark ? 40 : 90 }} transition={spring.smooth}>
        <mask id={maskId}>
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <motion.circle r="9" fill="black" initial={false} animate={dark ? { cx: 17, cy: 5 } : { cx: 30, cy: 0 }} transition={spring.smooth} />
        </mask>
        <motion.circle cx="12" cy="12" fill="currentColor" stroke="none" mask={`url(#${maskId})`} initial={false} animate={{ r: dark ? 9 : 5 }} transition={spring.smooth} />
        <motion.g initial={false} animate={{ opacity: dark ? 0 : 1, scale: dark ? 0.5 : 1 }} transition={spring.smooth} style={{ transformOrigin: "12px 12px" }}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1="12" y1="1.5" x2="12" y2="3.5" transform={`rotate(${a} 12 12)`} />
          ))}
        </motion.g>
      </motion.svg>
    </button>
  );
}
