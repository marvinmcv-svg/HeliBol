import type { ElementType } from "react";
import { cn } from "@kinetik/core/utils";

export interface TextGlitchProps {
  children: string;
  as?: ElementType;
  /** Seconds between glitch bursts (≥ 2 keeps it well under WCAG flash limits). */
  every?: number;
  className?: string;
}

const css = `
.k-glitch{position:relative;display:inline-block}
.k-glitch::before,.k-glitch::after{content:attr(data-text);position:absolute;inset:0;pointer-events:none}
.k-glitch::before{color:#22d3ee;animation:k-glitch-a var(--k-gl-every) steps(1) infinite;clip-path:inset(0 0 0 0)}
.k-glitch::after{color:#f43f5e;animation:k-glitch-b var(--k-gl-every) steps(1) infinite;clip-path:inset(0 0 0 0)}
@keyframes k-glitch-a{0%,88%,100%{transform:none;clip-path:inset(0 0 100% 0)}90%{transform:translate(-3px,1px);clip-path:inset(12% 0 55% 0)}93%{transform:translate(3px,-1px);clip-path:inset(60% 0 8% 0)}96%{transform:translate(-2px,0);clip-path:inset(35% 0 40% 0)}}
@keyframes k-glitch-b{0%,88%,100%{transform:none;clip-path:inset(0 0 100% 0)}91%{transform:translate(3px,0);clip-path:inset(50% 0 20% 0)}94%{transform:translate(-3px,1px);clip-path:inset(5% 0 70% 0)}97%{transform:translate(2px,-1px);clip-path:inset(75% 0 2% 0)}}
.k-glitch:hover::before,.k-glitch:hover::after{animation-duration:1.2s}
@media (prefers-reduced-motion:reduce){.k-glitch::before,.k-glitch::after{display:none}}
[data-reduce-motion] .k-glitch::before,[data-reduce-motion] .k-glitch::after{display:none}`;

/** RGB-split glitch in short, infrequent bursts (pure CSS). */
export function TextGlitch({ children, as: Tag = "span", every = 3, className }: TextGlitchProps) {
  return (
    <>
      <style href="k-glitch" precedence="kinetik">{css}</style>
      <Tag data-text={children} className={cn("k-glitch", className)} style={{ "--k-gl-every": `${every}s` } as React.CSSProperties}>
        {children}
      </Tag>
    </>
  );
}
