"use client";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@kinetik/core";

export interface ErrorShakeProps {
  /** Change this value (e.g. increment a counter) to trigger a shake. */
  trigger: unknown;
  children: ReactNode;
  className?: string;
}

const css = `
@keyframes k-shake{0%,100%{translate:0}15%{translate:-8px}30%{translate:7px}45%{translate:-5px}60%{translate:4px}75%{translate:-2px}}
.k-shake{animation:k-shake .45s cubic-bezier(.36,.07,.19,.97)}
@media (prefers-reduced-motion:reduce){.k-shake{animation:none}}
[data-reduce-motion] .k-shake{animation:none}`;

/** Shakes its children whenever `trigger` changes. Reduced motion: no movement (pair with a color/text error). */
export function ErrorShake({ trigger, children, className }: ErrorShakeProps) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (trigger) setN((x) => x + 1);
  }, [trigger]);
  return (
    <>
      <style href="k-shake" precedence="kinetik">{css}</style>
      <div key={n} className={cn(n > 0 && "k-shake", className)}>{children}</div>
    </>
  );
}
