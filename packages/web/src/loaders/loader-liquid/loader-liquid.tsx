"use client";
import { useId } from "react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface LoaderLiquidProps {
  /** 0–100. Omit for an indeterminate slosh. */
  value?: number;
  size?: number;
  color?: string;
  label?: string;
  className?: string;
}

/**
 * A glass orb filling with liquid: two counter-moving waves (SVG paths with SMIL loops) rise to the
 * value with a soft ease, bubbles drift up, and the number sits on top with a contrast flip where the
 * liquid passes behind it. Indeterminate mode bobs half full.
 */
export function LoaderLiquid({ value, size = 140, color = "#8b5cf6", label = "Loading", className }: LoaderLiquidProps) {
  const reduced = useReducedMotion();
  const id = `ll-${useId().replace(/:/g, "")}`;
  const v = value === undefined ? 50 : Math.max(0, Math.min(100, value));
  const level = 100 - v; // y of the surface in a 0–100 viewBox
  const wave = "M0 4 Q 12.5 0 25 4 T 50 4 T 75 4 T 100 4 T 125 4 T 150 4 T 175 4 T 200 4 V 120 H 0 Z";
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value === undefined ? undefined : Math.round(v)}
      className={cn("relative inline-grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden>
        <defs>
          <clipPath id={id}><circle cx="50" cy="50" r="46" /></clipPath>
          <radialGradient id={`${id}-g`} cx="35%" cy="30%" r="70%"><stop offset="0" stopColor="#fff" stopOpacity=".35" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="none" stroke={color} strokeOpacity=".35" strokeWidth="2" />
        <g clipPath={`url(#${id})`}>
          <g style={{ transform: `translateY(${level}px)`, transition: reduced ? undefined : "transform 1s cubic-bezier(.22,1,.36,1)" }}>
            <g>
            <g opacity=".5">
              <path d={wave} fill={color} />
              {!reduced && <animateTransform attributeName="transform" type="translate" from="-100 0" to="0 0" dur="3.2s" repeatCount="indefinite" />}
            </g>
            <g>
              <path d={wave} fill={color} transform="translate(0 3)" />
              {!reduced && <animateTransform attributeName="transform" type="translate" from="0 0" to="-100 0" dur="2s" repeatCount="indefinite" />}
            </g>
              {value === undefined && !reduced && <animateTransform attributeName="transform" type="translate" values="0 -4;0 4;0 -4" dur="2.4s" repeatCount="indefinite" />}
            </g>
          </g>
          {!reduced &&
            [18, 42, 64, 80].map((x, i) => (
              <circle key={x} cx={x} cy="100" r={1 + (i % 2)} fill="#fff" opacity=".55">
                <animate attributeName="cy" from="100" to={String(Math.max(level, 20))} dur={`${2 + i * 0.6}s`} begin={`${i * 0.5}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values=".6;0" dur={`${2 + i * 0.6}s`} begin={`${i * 0.5}s`} repeatCount="indefinite" />
              </circle>
            ))}
        </g>
        <circle cx="50" cy="50" r="46" fill={`url(#${id}-g)`} />
      </svg>
      {value !== undefined && (
        <span className="relative text-2xl font-semibold tabular-nums mix-blend-difference text-white">{Math.round(v)}%</span>
      )}
    </div>
  );
}
