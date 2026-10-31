import type { ReactNode } from "react";
import { cn } from "@kinetik/core/utils";

/** Image card: on hover/focus the photo zooms and darkens while a details panel slides up from the bottom. CSS only. */
export function CardHoverReveal({ image, title, subtitle, children, className }: { image: string; title: string; subtitle?: string; children?: ReactNode; className?: string }) {
  return (
    <article tabIndex={0} className={cn("group relative overflow-hidden rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}>
      <img src={image} alt="" className="h-full w-full object-cover transition-[scale,filter] duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-110 group-hover:brightness-50 group-focus-visible:scale-110 group-focus-visible:brightness-50 motion-reduce:transition-none" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <h3 className="text-lg font-semibold transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-1">{title}</h3>
        {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <div className="pt-3 text-sm text-white/85 opacity-0 transition-opacity delay-100 duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">{children}</div>
          </div>
        </div>
      </div>
    </article>
  );
}
