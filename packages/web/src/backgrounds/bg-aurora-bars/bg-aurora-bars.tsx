import { cn } from "@kinetik/core/utils";

export interface BgAuroraBarsProps {
  /** Number of vertical bars. */
  bars?: number;
  /** Gradient stops from base to tip. */
  colors?: [string, string, string];
  className?: string;
}

const css = `
@keyframes kn-aurora-bar { 0%,100% { transform: scaleY(var(--lo)); } 50% { transform: scaleY(var(--hi)); } }
.kn-abar { transform-origin: bottom; animation: kn-aurora-bar var(--d) ease-in-out var(--delay) infinite; transform: scaleY(var(--mid)); }
@media (prefers-reduced-motion: reduce) { .kn-abar { animation: none; } }
[data-reduce-motion] .kn-abar { animation: none; }
`;

/**
 * Soft vertical light bars rising from the bottom edge, each breathing at its own pace — an aurora
 * curtain built from scaleY-only CSS keyframes, blurred into one glow.
 */
export function BgAuroraBars({ bars = 28, colors = ["#4c1d95", "#db2777", "#fde68a"], className }: BgAuroraBarsProps) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 flex items-end gap-[0.6%] overflow-hidden px-[2%] [mask-image:linear-gradient(to_top,black_40%,transparent)]", className)}>
      <style href="kn-aurora-bars" precedence="kinetik">{css}</style>
      {Array.from({ length: bars }, (_, i) => {
        // deterministic pseudo-random per bar so SSR and client agree
        const r = (k: number) => ((Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1 + 1) % 1;
        const centre = 1 - Math.abs(i / (bars - 1) - 0.5) * 1.3; // taller in the middle
        const lo = 0.25 + r(1) * 0.25 * centre, hi = 0.55 + r(2) * 0.45 * centre;
        return (
          <span
            key={i}
            className="kn-abar h-full flex-1 rounded-t-full blur-[6px]"
            style={{
              background: `linear-gradient(to top, ${colors[0]}, ${colors[1]} 55%, ${colors[2]})`,
              opacity: 0.55 + r(3) * 0.4,
              ["--lo" as string]: lo,
              ["--hi" as string]: hi,
              ["--mid" as string]: (lo + hi) / 2,
              ["--d" as string]: `${4 + r(4) * 5}s`,
              ["--delay" as string]: `${-r(5) * 6}s`,
            }}
          />
        );
      })}
    </div>
  );
}
