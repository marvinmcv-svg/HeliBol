"use client";
import { useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@kinetik/core";

export interface MarqueeProps {
  children: ReactNode;
  /** Seconds per loop. */
  duration?: number;
  reverse?: boolean;
  vertical?: boolean;
  pauseOnHover?: boolean;
  /** Fade the edges with a mask. */
  fade?: boolean;
  /** Show a pause/play control (WCAG 2.2.2). */
  controls?: boolean;
  gap?: string;
  className?: string;
}

const css = `
.k-marquee{--k-gap:2rem;display:flex;overflow:hidden;gap:var(--k-gap)}
.k-marquee[data-vertical]{flex-direction:column}
.k-marquee-track{display:flex;flex-shrink:0;gap:var(--k-gap);min-width:100%;justify-content:space-around;animation:k-marquee-x var(--k-dur) linear infinite}
.k-marquee[data-vertical] .k-marquee-track{flex-direction:column;min-width:auto;min-height:100%;animation-name:k-marquee-y}
.k-marquee[data-reverse] .k-marquee-track{animation-direction:reverse}
.k-marquee[data-hover-pause]:hover .k-marquee-track,.k-marquee[data-paused] .k-marquee-track{animation-play-state:paused}
@keyframes k-marquee-x{to{transform:translateX(calc(-100% - var(--k-gap)))}}
@keyframes k-marquee-y{to{transform:translateY(calc(-100% - var(--k-gap)))}}
@media (prefers-reduced-motion:reduce){.k-marquee-track{animation-play-state:paused}}
[data-reduce-motion] .k-marquee-track{animation-play-state:paused!important}`;

export function Marquee({ children, duration = 30, reverse, vertical, pauseOnHover = true, fade = true, controls = false, gap = "2rem", className }: MarqueeProps) {
  const [paused, setPaused] = useState(false);
  const mask = vertical ? "linear-gradient(to bottom,transparent,#000 12%,#000 88%,transparent)" : "linear-gradient(to right,transparent,#000 10%,#000 90%,transparent)";
  return (
    <div className={cn("relative", className)}>
      <style href="k-marquee" precedence="kinetik">{css}</style>
      <div
        className={cn("k-marquee", vertical && "h-full")}
        data-vertical={vertical || undefined}
        data-reverse={reverse || undefined}
        data-hover-pause={pauseOnHover || undefined}
        data-paused={paused || undefined}
        style={{ "--k-dur": `${duration}s`, "--k-gap": gap, maskImage: fade ? mask : undefined, WebkitMaskImage: fade ? mask : undefined } as React.CSSProperties}
      >
        <div className="k-marquee-track">{children}</div>
        <div className="k-marquee-track" aria-hidden>{children}</div>
      </div>
      {controls && (
        <button onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play marquee" : "Pause marquee"} className="absolute top-1/2 right-0 grid size-7 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/80 text-muted-foreground backdrop-blur hover:text-foreground">
          {paused ? <Play className="size-3" /> : <Pause className="size-3" />}
        </button>
      )}
    </div>
  );
}
