import type { ButtonHTMLAttributes } from "react";
import { cn } from "@kinetik/core/utils";

export interface ButtonShimmerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Seconds between sweeps. */
  duration?: number;
  shimmerColor?: string;
  /** Render as a link instead of a button. */
  href?: string;
}

const css = `
.k-shimmer-btn{position:relative;overflow:hidden;isolation:isolate}
.k-shimmer-btn::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(110deg,transparent 35%,var(--k-shimmer-color) 50%,transparent 65%);background-size:250% 100%;animation:k-shimmer var(--k-shimmer-d) cubic-bezier(.4,0,.2,1) infinite}
@keyframes k-shimmer{0%{background-position:150% 0}60%,100%{background-position:-100% 0}}
@media (prefers-reduced-motion:reduce){.k-shimmer-btn::before{animation:none}}
[data-reduce-motion] .k-shimmer-btn::before{animation:none}`;

export function ButtonShimmer({ duration = 2.6, shimmerColor = "rgb(255 255 255 / .35)", href, className, style, ...props }: ButtonShimmerProps) {
  const Tag = (href ? "a" : "button") as "button";
  return (
    <>
      <style href="k-shimmer-btn" precedence="kinetik">{css}</style>
      <Tag
        {...(href ? { href } : {})}
        className={cn(
          "k-shimmer-btn inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#18181b,#3f3f46)] px-6 text-sm font-medium text-white shadow-[0_0_0_1px_rgb(255_255_255/.08)_inset,0_8px_24px_-8px_rgb(0_0_0/.5)] outline-none transition-[scale,box-shadow] duration-150 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className,
        )}
        style={{ "--k-shimmer-d": `${duration}s`, "--k-shimmer-color": shimmerColor, ...style } as React.CSSProperties}
        {...props}
      />
    </>
  );
}
