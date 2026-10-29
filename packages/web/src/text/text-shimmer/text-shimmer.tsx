import type { ElementType, ReactNode } from "react";
import { cn } from "@kinetik/core/utils";

export interface TextShimmerProps {
  children: ReactNode;
  as?: ElementType;
  duration?: number;
  /** Width of the highlight band in px. */
  spread?: number;
  className?: string;
}

const css = `
.k-text-shimmer{--k-sh-base:color-mix(in oklab,currentColor 45%,transparent);background:linear-gradient(90deg,var(--k-sh-base) calc(50% - var(--k-sh-spread)),currentColor 50%,var(--k-sh-base) calc(50% + var(--k-sh-spread))) 0 0/250% 100% no-repeat,var(--k-sh-base);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:k-text-shimmer var(--k-sh-duration) linear infinite}
@keyframes k-text-shimmer{from{background-position:100% 0}to{background-position:0% 0}}
@media (prefers-reduced-motion:reduce){.k-text-shimmer{animation:none;-webkit-text-fill-color:currentColor}}
[data-reduce-motion] .k-text-shimmer{animation:none;-webkit-text-fill-color:currentColor}`;

export function TextShimmer({ children, as: Tag = "span", duration = 2, spread = 40, className }: TextShimmerProps) {
  return (
    <>
      <style href="k-text-shimmer" precedence="kinetik">{css}</style>
      <Tag
        className={cn("k-text-shimmer inline-block", className)}
        style={{ "--k-sh-duration": `${duration}s`, "--k-sh-spread": `${spread}px` } as React.CSSProperties}
      >
        {children}
      </Tag>
    </>
  );
}
