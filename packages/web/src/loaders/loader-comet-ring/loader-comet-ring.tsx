import { cn } from "@kinetik/core/utils";

export interface LoaderCometRingProps {
  size?: number;
  /** Ring thickness in px. */
  thickness?: number;
  colors?: [string, string];
  label?: string;
  className?: string;
}

const css = `
@property --kn-comet { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
@keyframes kn-comet-spin { to { --kn-comet: 360deg; } }
@keyframes kn-comet-breathe { 50% { transform: scale(.92); } }
.kn-comet { animation: kn-comet-spin 1.1s linear infinite, kn-comet-breathe 2.2s ease-in-out infinite; }
.kn-comet-glow { animation: kn-comet-spin 1.1s linear infinite; }
@media (prefers-reduced-motion: reduce) { .kn-comet, .kn-comet-glow { animation: kn-comet-spin 4s linear infinite; } }
[data-reduce-motion] .kn-comet, [data-reduce-motion] .kn-comet-glow { animation: kn-comet-spin 4s linear infinite; }
`;

/**
 * A comet chasing its tail: a conic-gradient ring masked to a thin band whose start angle is an
 * animatable @property, so the bright head and fading tail rotate smoothly; a blurred copy adds glow
 * and the ring gently breathes. Zero JS. Reduced motion slows it to a calm 4 s turn (a loader must
 * still show activity).
 */
export function LoaderCometRing({ size = 64, thickness = 5, colors = ["#22d3ee", "#a855f7"], label = "Loading", className }: LoaderCometRingProps) {
  const ring = {
    background: `conic-gradient(from var(--kn-comet), transparent 0deg, ${colors[1]}22 90deg, ${colors[1]} 260deg, ${colors[0]} 340deg, #fff 352deg, transparent 360deg)`,
    WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px + 1px))`,
    mask: `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px + 1px))`,
  } as const;
  return (
    <span role="status" aria-label={label} className={cn("relative inline-block", className)} style={{ width: size, height: size }}>
      <style href="kn-loader-comet-ring" precedence="kinetik">{css}</style>
      <span aria-hidden className="kn-comet-glow absolute inset-0 rounded-full opacity-70 blur-md" style={ring} />
      <span aria-hidden className="kn-comet absolute inset-0 rounded-full" style={ring} />
      <span className="sr-only">{label}…</span>
    </span>
  );
}
