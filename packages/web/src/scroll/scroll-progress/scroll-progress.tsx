"use client";
import { useEffect, useRef, type RefObject } from "react";
import { cn } from "@kinetik/core";

export interface ScrollProgressProps {
  /** Scroll container; defaults to the page. Must be an ancestor for the CSS path. */
  container?: RefObject<HTMLElement | null>;
  variant?: "bar" | "circle";
  className?: string;
}

const css = `
@keyframes k-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes k-progress-ring{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}
@supports (animation-timeline: scroll()){
  .k-progress-bar[data-css]{animation:k-progress linear both;animation-timeline:scroll(nearest)}
  .k-progress-ring[data-css]{animation:k-progress-ring linear both;animation-timeline:scroll(nearest)}
}`;

export function ScrollProgress({ container, variant = "bar", className }: ScrollProgressProps) {
  const bar = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const supports = typeof CSS !== "undefined" && CSS.supports?.("animation-timeline: scroll()");

  // JS fallback (Firefox < scroll-timeline, older Safari)
  useEffect(() => {
    if (supports) return;
    const el: HTMLElement | Window = container?.current ?? window;
    const update = () => {
      const t = el instanceof Window ? document.documentElement : el;
      const p = t.scrollTop / Math.max(1, t.scrollHeight - t.clientHeight);
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      if (ring.current) ring.current.style.strokeDashoffset = String(100 - p * 100);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, [container, supports]);

  return (
    <>
      <style href="k-progress" precedence="kinetik">{css}</style>
      {variant === "bar" ? (
        <div
          ref={bar}
          data-css={supports ? "" : undefined}
          role="presentation"
          className={cn("k-progress-bar h-1 w-full origin-left bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400", className)}
          style={{ transform: "scaleX(0)" }}
        />
      ) : (
        <svg viewBox="0 0 36 36" className={cn("size-10 -rotate-90", className)} role="presentation">
          <circle cx="18" cy="18" r="15.9" pathLength={100} fill="none" className="stroke-muted" strokeWidth="3" />
          <circle ref={ring} data-css={supports ? "" : undefined} cx="18" cy="18" r="15.9" pathLength={100} fill="none" className="k-progress-ring stroke-foreground" strokeWidth="3" strokeLinecap="round" strokeDasharray="100" strokeDashoffset="100" />
        </svg>
      )}
    </>
  );
}
