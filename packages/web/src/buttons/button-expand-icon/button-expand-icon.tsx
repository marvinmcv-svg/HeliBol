import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@kinetik/core/utils";

export interface ButtonExpandIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
}

/** An icon-only circle that smoothly widens to reveal its label on hover/focus (grid 0fr→1fr trick, CSS only). */
export function ButtonExpandIcon({ icon, label, className, ...props }: ButtonExpandIconProps) {
  return (
    <button
      aria-label={label}
      className={cn("group inline-flex h-11 items-center rounded-full bg-foreground px-3 text-background outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background", className)}
      {...props}
    >
      <span className="grid size-5 shrink-0 place-items-center [&>svg]:size-5">{icon}</span>
      <span className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-300 ease-[cubic-bezier(.2,0,0,1)] group-hover:grid-cols-[1fr] group-focus-visible:grid-cols-[1fr] motion-reduce:transition-none">
        <span className="overflow-hidden">
          <span className="block pl-2 pr-1 text-sm font-medium whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:delay-100 group-focus-visible:opacity-100" aria-hidden>
            {label}
          </span>
        </span>
      </span>
    </button>
  );
}
