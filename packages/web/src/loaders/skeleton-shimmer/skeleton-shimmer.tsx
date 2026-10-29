import type { HTMLAttributes } from "react";
import { cn } from "@kinetik/core/utils";

const css = `
.k-skel{position:relative;overflow:hidden;background:color-mix(in oklab,var(--color-foreground,#888) 8%,transparent)}
.k-skel::after{content:"";position:absolute;inset:0;translate:-100% 0;background:linear-gradient(90deg,transparent,color-mix(in oklab,var(--color-foreground,#888) 9%,transparent),transparent);animation:k-skel 1.6s cubic-bezier(.4,0,.2,1) infinite}
@keyframes k-skel{to{translate:100% 0}}
@media (prefers-reduced-motion:reduce){.k-skel::after{animation:none;display:none}}
[data-reduce-motion] .k-skel::after{display:none}`;

/** Skeleton block with a sweeping highlight. Size it with Tailwind classes. */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <>
      <style href="k-skel" precedence="kinetik">{css}</style>
      <div aria-hidden className={cn("k-skel rounded-md", className)} {...props} />
    </>
  );
}
