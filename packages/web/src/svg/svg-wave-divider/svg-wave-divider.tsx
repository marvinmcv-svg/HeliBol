"use client";
import { cn, useReducedMotion } from "@kinetik/core";

export interface SvgWaveDividerProps {
  /** Colours of the layers, back to front. The last should match the next section's background. */
  colors?: string[];
  /** Height in px. */
  height?: number;
  /** Flip vertically (for the top of a section). */
  flip?: boolean;
  className?: string;
}

/**
 * Section divider of stacked ocean waves: each layer is a seamless SVG wave tile drifting at its own
 * speed and direction (SMIL translate loops), back layers paler and slower, giving parallax depth
 * between two sections. Static waves under reduced motion.
 */
export function SvgWaveDivider({ colors = ["#c4b5fd", "#a78bfa", "#8b5cf6", "var(--color-background, #fff)"], height = 120, flip = false, className }: SvgWaveDividerProps) {
  const reduced = useReducedMotion();
  const n = colors.length;
  return (
    <div aria-hidden className={cn("relative w-full overflow-hidden leading-[0]", flip && "-scale-y-100", className)} style={{ height }}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute inset-0 size-full">
        {colors.map((c, i) => {
          const amp = 14 + i * 4;
          const y = 30 + i * 18;
          const d = `M0 ${y} C 150 ${y - amp}, 450 ${y + amp}, 600 ${y} S 1050 ${y - amp}, 1200 ${y} S 1650 ${y + amp}, 1800 ${y} S 2250 ${y - amp}, 2400 ${y} V 120 H 0 Z`;
          const dur = 10 + (n - i) * 4;
          return (
            <g key={i} opacity={i === n - 1 ? 1 : 0.5 + (i / n) * 0.4}>
              <path d={d} fill={c} />
              {!reduced && <animateTransform attributeName="transform" type="translate" from={i % 2 ? "-1200 0" : "0 0"} to={i % 2 ? "0 0" : "-1200 0"} dur={`${dur}s`} repeatCount="indefinite" />}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
