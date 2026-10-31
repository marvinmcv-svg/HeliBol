import type { ReactNode } from "react";
import { cn } from "@kinetik/core/utils";

/** A specular highlight sweeps diagonally across the card on hover/focus — product tiles, pricing cards. CSS only. */
export function CardShine({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div tabIndex={0} className={cn("group relative overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}>
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-[left] duration-700 ease-[cubic-bezier(.4,0,.2,1)] group-hover:left-[150%] group-focus-visible:left-[150%] motion-reduce:hidden"
      />
    </div>
  );
}
