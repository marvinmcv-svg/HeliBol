"use client";
import { useRef, type ReactNode } from "react";
import { cn, useInView } from "@kinetik/core";

export interface TextHighlighterProps {
  children: ReactNode;
  variant?: "marker" | "underline";
  color?: string;
  delay?: number;
  duration?: number;
  className?: string;
}

const css = `
.k-hl{background-repeat:no-repeat;background-size:0% var(--k-hl-h);background-position:0 var(--k-hl-y);transition:background-size var(--k-hl-d) cubic-bezier(.16,1,.3,1) var(--k-hl-delay);padding:0 .1em;margin:0 -.1em;-webkit-box-decoration-break:clone;box-decoration-break:clone}
.k-hl[data-in]{background-size:100% var(--k-hl-h)}
@media (prefers-reduced-motion:reduce){.k-hl{transition:none}}
[data-reduce-motion] .k-hl{transition:none}`;

export function TextHighlighter({ children, variant = "marker", color = "rgb(250 204 21 / .55)", delay = 0, duration = 0.9, className }: TextHighlighterProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.8 });
  return (
    <>
      <style href="k-hl" precedence="kinetik">{css}</style>
      <mark
        ref={ref}
        data-in={inView ? "" : undefined}
        className={cn("k-hl rounded-sm bg-transparent text-inherit", className)}
        style={
          {
            backgroundImage: `linear-gradient(${color},${color})`,
            "--k-hl-h": variant === "marker" ? "88%" : "0.18em",
            "--k-hl-y": variant === "marker" ? "60%" : "100%",
            "--k-hl-d": `${duration}s`,
            "--k-hl-delay": `${delay}s`,
          } as React.CSSProperties
        }
      >
        {children}
      </mark>
    </>
  );
}
