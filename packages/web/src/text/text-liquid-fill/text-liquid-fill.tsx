"use client";
import { useId } from "react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface TextLiquidFillProps {
  text: string;
  /** 0–100: how full the letters are. Animate it for progress, scroll or loading. */
  level?: number;
  color?: string;
  /** Second, slower wave colour for depth. */
  colorBack?: string;
  className?: string;
}

/**
 * Letters as glass vessels: two offset waves (SVG, clipped to the text) slosh inside the outlined
 * type and rise to `level` with a soft ease — great for loaders, counters and scroll progress.
 */
export function TextLiquidFill({ text, level = 60, color = "#38bdf8", colorBack = "#818cf8", className }: TextLiquidFillProps) {
  const reduced = useReducedMotion();
  const id = `liq-${useId().replace(/:/g, "")}`;
  const y = 100 - Math.max(0, Math.min(100, level));
  const wave = "M0 8 Q 25 0 50 8 T 100 8 T 150 8 T 200 8 V 120 H 0 Z";
  return (
    <span className={cn("relative inline-block", className)} role="img" aria-label={`${text} — ${Math.round(level)}% full`}>
      <svg viewBox="0 0 1000 200" className="block h-[1.1em] w-auto overflow-visible" aria-hidden>
        <defs>
          <clipPath id={id}>
            <text x="500" y="160" textAnchor="middle" fontSize="190" fontWeight="900" fontFamily="inherit" letterSpacing="-6">{text}</text>
          </clipPath>
        </defs>
        <text x="500" y="160" textAnchor="middle" fontSize="190" fontWeight="900" fontFamily="inherit" letterSpacing="-6" fill="none" stroke="currentColor" strokeOpacity=".35" strokeWidth="3">{text}</text>
        <g clipPath={`url(#${id})`}>
          <g style={{ transform: `translateY(${y * 2}px)`, transition: reduced ? undefined : "transform 1.2s cubic-bezier(.22,1,.36,1)" }}>
            <svg x="0" y="-10" width="2000" height="240" viewBox="0 0 200 120" preserveAspectRatio="none" overflow="visible">
              <g opacity=".7">
                <path d={wave} fill={colorBack} />
                <path d={wave} transform="translate(200 0)" fill={colorBack} />
                {!reduced && <animateTransform attributeName="transform" type="translate" from="-200 0" to="0 0" dur="4.2s" repeatCount="indefinite" />}
              </g>
              <g>
                <path d={wave} fill={color} transform="translate(0 4)" />
                <path d={wave} fill={color} transform="translate(200 4)" />
                {!reduced && <animateTransform attributeName="transform" type="translate" from="0 0" to="-200 0" dur="2.6s" repeatCount="indefinite" />}
              </g>
            </svg>
          </g>
        </g>
      </svg>
    </span>
  );
}
