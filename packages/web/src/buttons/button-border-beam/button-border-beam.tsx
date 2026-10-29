import type { ButtonHTMLAttributes } from "react";
import { cn } from "@kinetik/core/utils";

export interface ButtonBorderBeamProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
}

const css = `
@property --k-beam-angle{syntax:"<angle>";initial-value:0deg;inherits:false}
.k-beam{position:relative;isolation:isolate}
.k-beam::before{content:"";position:absolute;inset:0;padding:1.5px;border-radius:inherit;background:conic-gradient(from var(--k-beam-angle),transparent 0 70%,var(--k-beam-from) 80%,var(--k-beam-to) 90%,transparent 100%);-webkit-mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);animation:k-beam-spin var(--k-beam-d) linear infinite;z-index:-1}
.k-beam::after{content:"";position:absolute;inset:-6px;border-radius:inherit;background:conic-gradient(from var(--k-beam-angle),transparent 0 75%,var(--k-beam-to) 90%,transparent 100%);filter:blur(12px);opacity:.45;animation:k-beam-spin var(--k-beam-d) linear infinite;z-index:-2}
@keyframes k-beam-spin{to{--k-beam-angle:360deg}}
@media (prefers-reduced-motion:reduce){.k-beam::before,.k-beam::after{animation:none}}
[data-reduce-motion] .k-beam::before,[data-reduce-motion] .k-beam::after{animation:none}`;

export function ButtonBorderBeam({ duration = 3, colorFrom = "#a855f7", colorTo = "#22d3ee", className, style, ...props }: ButtonBorderBeamProps) {
  return (
    <>
      <style href="k-beam" precedence="kinetik">{css}</style>
      <button
        className={cn(
          "k-beam inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-medium text-foreground outline-none transition-[scale] duration-150 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className,
        )}
        style={{ "--k-beam-d": `${duration}s`, "--k-beam-from": colorFrom, "--k-beam-to": colorTo, ...style } as React.CSSProperties}
        {...props}
      />
    </>
  );
}
