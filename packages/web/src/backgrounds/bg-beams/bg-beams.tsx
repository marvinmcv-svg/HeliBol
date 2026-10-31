"use client";
import { useMemo, type ReactNode } from "react";
import { cn } from "@kinetik/core";

const css = `
.k-beam-line{position:absolute;top:-30%;width:1px;height:30%;background:linear-gradient(to bottom,transparent,var(--k-bc),transparent);animation:k-beam-fall linear infinite}
@keyframes k-beam-fall{to{transform:translateY(450%)}}
@media (prefers-reduced-motion:reduce){.k-beam-line{display:none}}
[data-reduce-motion] .k-beam-line{display:none}`;

/** Thin light beams fall down a vertical rail grid at different speeds — the "data rain" for dev-tool heroes. */
export function BgBeams({ children, count = 14, color = "rgb(139 92 246)", className }: { children?: ReactNode; count?: number; color?: string; className?: string }) {
  const beams = useMemo(() => Array.from({ length: count }, (_, i) => ({ left: `${((i + 0.5) / count) * 100}%`, dur: `${3 + ((i * 37) % 5)}s`, delay: `${(i * 53) % 7}s` })), [count]);
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <style href="k-beam-fall" precedence="kinetik">{css}</style>
      <div aria-hidden className="absolute inset-0 -z-10" style={{ "--k-bc": color } as React.CSSProperties}>
        {beams.map((b, i) => (
          <div key={i} className="absolute inset-y-0 w-px bg-border/60" style={{ left: b.left }}>
            <span className="k-beam-line" style={{ animationDuration: b.dur, animationDelay: b.delay }} />
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}
