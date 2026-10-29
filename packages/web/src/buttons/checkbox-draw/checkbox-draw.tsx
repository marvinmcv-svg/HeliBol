"use client";
import { useId, useState, type ReactNode } from "react";
import { cn } from "@kinetik/core";

export interface CheckboxDrawProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  children?: ReactNode;
  /** Strike through the label when checked (todo lists). */
  strike?: boolean;
  className?: string;
}

const css = `
.k-check-path{stroke-dasharray:22;stroke-dashoffset:22;transition:stroke-dashoffset .25s cubic-bezier(.16,1,.3,1) .05s}
.k-check-input:checked+.k-check-box .k-check-path{stroke-dashoffset:0}
.k-check-box{transition:background-color .15s,border-color .15s,scale .15s}
.k-check-input:active+.k-check-box{scale:.9}
.k-check-label{background:linear-gradient(currentColor,currentColor) 0 55%/0% 1.5px no-repeat;transition:background-size .3s cubic-bezier(.16,1,.3,1),color .3s}
.k-check-input:checked~.k-check-label[data-strike]{background-size:100% 1.5px;color:var(--color-muted-foreground,gray)}
@media (prefers-reduced-motion:reduce){.k-check-path,.k-check-label{transition:none}}
[data-reduce-motion] .k-check-path,[data-reduce-motion] .k-check-label{transition:none}`;

export function CheckboxDraw({ checked, defaultChecked, onCheckedChange, children, strike = false, className }: CheckboxDrawProps) {
  const id = useId();
  const [internal, setInternal] = useState(defaultChecked ?? false);
  const isChecked = checked ?? internal;
  return (
    <>
      <style href="k-check" precedence="kinetik">{css}</style>
      <label htmlFor={id} className={cn("inline-flex cursor-pointer items-center gap-3 text-sm", className)}>
        <input
          id={id}
          type="checkbox"
          className="k-check-input peer sr-only"
          checked={isChecked}
          onChange={(e) => {
            if (checked === undefined) setInternal(e.target.checked);
            onCheckedChange?.(e.target.checked);
          }}
        />
        <span className="k-check-box grid size-5 shrink-0 place-items-center rounded-md border-2 border-muted-foreground/40 peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background">
          <svg viewBox="0 0 24 24" className="size-3.5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path className="k-check-path" d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        {children && <span className="k-check-label" data-strike={strike || undefined}>{children}</span>}
      </label>
    </>
  );
}
