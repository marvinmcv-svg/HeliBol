import type { ReactNode } from "react";
import { cn } from "@kinetik/core/utils";

export function BentoGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid auto-rows-[11rem] grid-cols-1 gap-3 sm:grid-cols-3", className)}>{children}</div>;
}

export interface BentoTileProps {
  title: string;
  description?: string;
  /** Visual area — put a micro-animation here. */
  visual?: ReactNode;
  className?: string;
}

/** A tile that lifts its visual and reveals a CTA on hover/focus-within. */
export function BentoTile({ title, description, visual, className }: BentoTileProps) {
  return (
    <div
      tabIndex={0}
      className={cn(
        "group relative flex flex-col justify-end overflow-hidden rounded-3xl border border-border bg-card p-5 outline-none transition-shadow duration-300 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-2 group-hover:scale-[1.02] group-focus-within:-translate-y-2 motion-reduce:transform-none">
        {visual}
      </div>
      <div className="relative transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-6 group-focus-within:-translate-y-6 motion-reduce:transform-none">
        <h3 className="font-semibold">{title}</h3>
        {description && <p className="mt-1 max-w-xs text-sm text-muted-foreground">{description}</p>}
      </div>
      <span className="absolute bottom-4 left-5 translate-y-6 text-xs font-medium text-brand opacity-0 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
        Learn more →
      </span>
    </div>
  );
}
