"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(useGSAP);

export interface GsapKeyframesLoaderProps {
  /** Accessible label announced to screen readers. */
  label?: string;
  colors?: string[];
  size?: number;
  className?: string;
}

const DEFAULT_COLORS = ["#a78bfa", "#f472b6", "#fbbf24", "#34d399"];

/**
 * A loader choreographed entirely with GSAP keyframes: four blocks hop, squash on landing, swap
 * places around a square and spin, each block offset in time — one keyframes array + stagger, no
 * timeline bookkeeping. Reduced motion: a gentle opacity pulse.
 */
export function GsapKeyframesLoader({ label = "Loading", colors = DEFAULT_COLORS, size = 18, className }: GsapKeyframesLoaderProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const gap = size * 1.4;

  useGSAP(
    () => {
      const blocks = gsap.utils.toArray<HTMLElement>("[data-block]");
      if (reduced) {
        gsap.to(blocks, { opacity: 0.35, duration: 0.8, repeat: -1, yoyo: true, stagger: 0.2, ease: "sine.inOut" });
        return;
      }
      gsap.to(blocks, {
        keyframes: {
          // percentage keyframes; easeEach shapes every segment
          "0%": { x: 0, y: 0, scaleX: 1, scaleY: 1, rotate: 0 },
          "15%": { y: -size * 1.6, scaleX: 0.9, scaleY: 1.12 },
          "30%": { x: gap, y: 0, scaleX: 1.25, scaleY: 0.75 },
          "40%": { scaleX: 1, scaleY: 1, rotate: 90 },
          "55%": { y: gap, x: gap, rotate: 180 },
          "70%": { x: 0, y: gap, rotate: 270 },
          "85%": { x: 0, y: 0, rotate: 360, scaleX: 1.15, scaleY: 0.85 },
          "100%": { scaleX: 1, scaleY: 1, rotate: 360 },
          easeEach: "power2.inOut",
        },
        duration: 2.4,
        stagger: { each: 0.6, repeat: -1 },
      });
    },
    { scope: root, dependencies: [reduced, size], revertOnUpdate: true },
  );

  return (
    <div ref={root} role="status" aria-label={label} className={cn("relative", className)} style={{ width: gap + size, height: gap + size }}>
      {colors.slice(0, 4).map((c, i) => (
        <span
          key={i}
          data-block
          aria-hidden
          className="absolute rounded-[28%]"
          style={{ width: size, height: size, background: c, left: (i % 2) * gap, top: Math.floor(i / 2) * gap, boxShadow: `0 6px 18px -6px ${c}` }}
        />
      ))}
      <span className="sr-only">{label}…</span>
    </div>
  );
}
