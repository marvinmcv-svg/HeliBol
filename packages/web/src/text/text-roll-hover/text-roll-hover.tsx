"use client";
import type { ElementType } from "react";
import { cn } from "@kinetik/core";

export interface TextRollHoverProps {
  children: string;
  as?: ElementType;
  /** stagger per letter in seconds */
  stagger?: number;
  /** "center" staggers outward from the middle */
  from?: "start" | "center" | "end";
  className?: string;
}

const css = `
.k-roll{display:inline-flex;overflow:hidden;line-height:1.15}
.k-roll-ch{display:inline-flex;flex-direction:column;transition:translate .45s cubic-bezier(.76,0,.24,1) var(--k-d)}
.k-roll:hover .k-roll-ch,.k-roll:focus-visible .k-roll-ch,a:hover>.k-roll .k-roll-ch,button:hover>.k-roll .k-roll-ch{translate:0 -50%}
@media (prefers-reduced-motion:reduce){.k-roll-ch{transition:none}}
[data-reduce-motion] .k-roll-ch{transition:none}`;

/** Each letter rolls up to reveal a copy of itself, staggered — the agency-nav hover. CSS only. */
export function TextRollHover({ children, as: Tag = "span", stagger = 0.025, from = "start", className }: TextRollHoverProps) {
  const chars = Array.from(children);
  const mid = (chars.length - 1) / 2;
  return (
    <>
      <style href="k-roll" precedence="kinetik">{css}</style>
      <Tag className={cn("k-roll", className)} aria-label={children}>
        {chars.map((ch, i) => {
          const order = from === "center" ? Math.abs(i - mid) : from === "end" ? chars.length - 1 - i : i;
          return (
            <span key={i} aria-hidden className="k-roll-ch" style={{ "--k-d": `${order * stagger}s` } as React.CSSProperties}>
              <span className="whitespace-pre">{ch}</span>
              <span className="whitespace-pre">{ch}</span>
            </span>
          );
        })}
      </Tag>
    </>
  );
}
