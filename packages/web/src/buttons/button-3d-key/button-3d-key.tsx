import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@kinetik/core/utils";

export interface Button3DKeyProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** Key cap colour (any CSS colour). */
  color?: string;
  /** Depth of the key in px. */
  depth?: number;
}

const css = `
.kn-key { position: relative; background: transparent; border: 0; padding: 0; cursor: pointer; }
.kn-key > span { position: absolute; inset: 0; border-radius: inherit; }
.kn-key .kn-key-shadow { background: rgb(0 0 0 / .3); filter: blur(5px); transform: translateY(calc(var(--d) + 3px)); }
.kn-key .kn-key-edge { background: linear-gradient(to left, color-mix(in oklab, var(--kc) 45%, black), color-mix(in oklab, var(--kc) 65%, black) 10%, color-mix(in oklab, var(--kc) 65%, black) 90%, color-mix(in oklab, var(--kc) 45%, black)); }
.kn-key .kn-key-cap { position: relative; display: flex; align-items: center; justify-content: center; gap: .5rem; height: 100%; padding: 0 1.75rem; background: var(--kc); transform: translateY(calc(var(--d) * -1)); box-shadow: inset 0 1px 0 rgb(255 255 255 / .35); }
.kn-key .kn-key-cap, .kn-key .kn-key-shadow { transition: transform .5s cubic-bezier(.3,.7,.4,1), filter .5s; }
.kn-key:hover .kn-key-cap { transform: translateY(calc(var(--d) * -1.35)); transition-duration: .25s; transition-timing-function: cubic-bezier(.3,.7,.4,1.5); }
.kn-key:hover .kn-key-shadow { transform: translateY(calc(var(--d) + 6px)); filter: blur(8px); transition-duration: .25s; }
.kn-key:active .kn-key-cap { transform: translateY(-2px); transition-duration: .04s; }
.kn-key:active .kn-key-shadow { transform: translateY(2px); filter: blur(3px); transition-duration: .04s; }
@media (prefers-reduced-motion: reduce) { .kn-key .kn-key-cap, .kn-key .kn-key-shadow { transition: none; } }
[data-reduce-motion] .kn-key .kn-key-cap, [data-reduce-motion] .kn-key .kn-key-shadow { transition: none; }
`;

/**
 * A tactile 3D key: a raised cap over a darker edge with a soft drop shadow. Hover lifts it with a
 * small overshoot, press sinks it almost flush, release springs back slowly — the classic
 * "pushable" button, mechanical and satisfying. Pure CSS; any colour via color-mix.
 */
export function Button3DKey({ children, color = "#f43f5e", depth = 6, className, style, ...rest }: Button3DKeyProps) {
  return (
    <>
      <style href="kn-button-3d-key" precedence="kinetik">{css}</style>
      <button
        {...rest}
        className={cn("kn-key inline-block h-14 rounded-2xl text-base font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4", className)}
        style={{ ...style, ["--kc" as string]: color, ["--d" as string]: `${depth}px`, marginTop: depth }}
      >
        <span aria-hidden className="kn-key-shadow" />
        <span aria-hidden className="kn-key-edge" />
        <span className="kn-key-cap">{children}</span>
      </button>
    </>
  );
}
