import type { ButtonHTMLAttributes } from "react";
import { cn } from "@kinetik/core/utils";

const css = `
.k-pulse{position:relative}
.k-pulse::before,.k-pulse::after{content:"";position:absolute;inset:0;border-radius:inherit;background:inherit;z-index:-1;animation:k-pulse 2.2s cubic-bezier(0,0,.2,1) infinite}
.k-pulse::after{animation-delay:1.1s}
@keyframes k-pulse{0%{transform:scale(1);opacity:.55}100%{transform:scale(1.6,2);opacity:0}}
@media (prefers-reduced-motion:reduce){.k-pulse::before,.k-pulse::after{animation:none;opacity:0}}
[data-reduce-motion] .k-pulse::before,[data-reduce-motion] .k-pulse::after{animation:none;opacity:0}`;

/** CTA that emits two staggered sonar rings — draws attention to one primary action (use sparingly). */
export function ButtonPulse({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <>
      <style href="k-pulse" precedence="kinetik">{css}</style>
      <span className="relative isolate inline-flex">
        <button className={cn("k-pulse inline-flex h-11 items-center gap-2 rounded-full bg-rose-500 px-6 text-sm font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background", className)} {...props} />
      </span>
    </>
  );
}
