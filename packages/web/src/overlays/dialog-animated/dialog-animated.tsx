"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@kinetik/core";

export interface DialogAnimatedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

/*
 * Native <dialog> + @starting-style: real focus trapping, Esc, top-layer and inert background
 * for free, with enter AND exit animations in pure CSS (overlay + display allow-discrete).
 */
const css = `
.k-dialog{opacity:0;scale:.96;translate:0 8px;transition:opacity .22s cubic-bezier(.4,0,1,1),scale .22s cubic-bezier(.4,0,1,1),translate .22s cubic-bezier(.4,0,1,1),overlay .22s allow-discrete,display .22s allow-discrete}
.k-dialog[open]{opacity:1;scale:1;translate:0 0;transition-timing-function:cubic-bezier(.16,1,.3,1);transition-duration:.32s}
@starting-style{.k-dialog[open]{opacity:0;scale:.96;translate:0 8px}}
.k-dialog::backdrop{background:rgb(0 0 0/0);backdrop-filter:blur(0);transition:background .32s,backdrop-filter .32s,overlay .32s allow-discrete,display .32s allow-discrete}
.k-dialog[open]::backdrop{background:rgb(0 0 0/.45);backdrop-filter:blur(4px)}
@starting-style{.k-dialog[open]::backdrop{background:rgb(0 0 0/0);backdrop-filter:blur(0)}}
@media (prefers-reduced-motion:reduce){.k-dialog{scale:1!important;translate:0!important}}
[data-reduce-motion] .k-dialog{scale:1!important;translate:0!important}`;

export function DialogAnimated({ open, onOpenChange, title, description, children, className }: DialogAnimatedProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <>
      <style href="k-dialog" precedence="kinetik">{css}</style>
      <dialog
        ref={ref}
        onClose={() => onOpenChange(false)}
        onClick={(e) => e.target === e.currentTarget && onOpenChange(false)}
        aria-labelledby={titleId}
        className={cn("k-dialog m-auto w-[min(92vw,26rem)] rounded-2xl border border-border bg-card p-0 text-card-foreground shadow-2xl", className)}
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="text-lg font-semibold">{title}</h2>
              {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            </div>
            <button onClick={() => onOpenChange(false)} aria-label="Close" className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-accent"><X className="size-4" /></button>
          </div>
          {children && <div className="mt-5">{children}</div>}
        </div>
      </dialog>
    </>
  );
}
