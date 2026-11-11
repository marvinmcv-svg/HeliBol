"use client";
import { useRef, type ReactNode } from "react";
import { cn, usePrefersTouch, useReducedMotion } from "@kinetik/core";

export interface CardAuroraProps {
  children: ReactNode;
  /** Three aurora colours. */
  colors?: [string, string, string];
  className?: string;
}

const css = `
@keyframes kn-aurora-drift { 0% { transform: translate(-10%, -6%) rotate(0deg) scale(1); } 50% { transform: translate(8%, 6%) rotate(160deg) scale(1.15); } 100% { transform: translate(-10%, -6%) rotate(360deg) scale(1); } }
.kn-aurora-blob { animation: kn-aurora-drift var(--d) linear infinite; }
.kn-aurora-card:hover .kn-aurora-layer, .kn-aurora-card:focus-within .kn-aurora-layer { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .kn-aurora-blob { animation: none; } }
[data-reduce-motion] .kn-aurora-blob { animation: none; }
`;

/**
 * A quiet card that wakes up on hover: drifting aurora blobs fade in behind frosted glass and lean
 * toward the cursor (CSS variables, no re-renders). The border picks up the same light.
 */
export function CardAurora({ children, colors = ["#22d3ee", "#a78bfa", "#f472b6"], className }: CardAuroraProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const touch = usePrefersTouch();
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        if (reduced || touch || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        ref.current.style.setProperty("--mx", `${((e.clientX - r.left) / r.width - 0.5) * 30}%`);
        ref.current.style.setProperty("--my", `${((e.clientY - r.top) / r.height - 0.5) * 30}%`);
      }}
      className={cn("kn-aurora-card group relative overflow-hidden rounded-3xl border border-border bg-card p-px", className)}
    >
      <style href="kn-card-aurora" precedence="kinetik">{css}</style>
      <div aria-hidden className="kn-aurora-layer absolute inset-0 opacity-30 transition-opacity duration-700" style={{ transform: "translate(var(--mx, 0), var(--my, 0))", transition: "opacity .7s, transform .6s cubic-bezier(.2,.8,.2,1)" }}>
        {colors.map((c, i) => (
          <span
            key={i}
            className="kn-aurora-blob absolute size-[70%] rounded-full blur-3xl"
            style={{ background: c, left: `${[-10, 35, 10][i]}%`, top: `${[-15, 10, 45][i]}%`, opacity: 0.7, ["--d" as string]: `${14 + i * 5}s`, animationDirection: i % 2 ? "reverse" : "normal" }}
          />
        ))}
      </div>
      <div className="relative h-full rounded-[calc(1.5rem-1px)] bg-card/70 p-6 backdrop-blur-2xl">{children}</div>
    </div>
  );
}
