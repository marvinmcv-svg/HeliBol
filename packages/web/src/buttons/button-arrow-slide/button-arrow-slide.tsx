import type { ButtonHTMLAttributes } from "react";
import { cn } from "@kinetik/core/utils";

/** On hover a fill sweeps in from the left, the label nudges and the arrow exits right as a new one enters. CSS only. */
export function ButtonArrowSlide({ className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const arrow = <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>;
  return (
    <button
      className={cn(
        "group relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-full border border-foreground/15 bg-background pr-2 pl-6 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    >
      <span aria-hidden className="absolute inset-0 origin-left scale-x-0 rounded-full bg-foreground transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none" />
      <span className="relative transition-[color,translate] duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:translate-x-1 group-hover:text-background group-focus-visible:text-background">{children}</span>
      <span className="relative grid size-8 place-items-center overflow-hidden rounded-full bg-foreground text-background transition-colors duration-500 group-hover:bg-background group-hover:text-foreground">
        <span className="transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:translate-x-8 motion-reduce:transition-none">{arrow}</span>
        <span className="absolute -translate-x-8 transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:translate-x-0 motion-reduce:transition-none">{arrow}</span>
      </span>
    </button>
  );
}
