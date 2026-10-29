import type { ButtonHTMLAttributes } from "react";
import { cn } from "@kinetik/core/utils";

export interface ButtonPressProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

/** The base button every kinetik button builds on: hover lift, press squash, crisp focus ring. */
export function ButtonPress({ variant = "primary", size = "md", className, ...props }: ButtonPressProps) {
  return (
    <button
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 rounded-xl font-medium outline-none",
        "transition-[translate,scale,box-shadow,background-color] duration-150 ease-[cubic-bezier(.2,0,0,1)]",
        "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] active:duration-100",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50 motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100",
        variant === "primary" && "bg-primary text-primary-foreground shadow-[0_1px_2px_rgb(0_0_0/.2),inset_0_1px_0_rgb(255_255_255/.12)] hover:shadow-lg hover:shadow-primary/20",
        variant === "secondary" && "border border-border bg-card text-foreground shadow-sm hover:shadow-md",
        variant === "ghost" && "text-foreground hover:bg-accent",
        size === "sm" && "h-8 px-3 text-xs",
        size === "md" && "h-10 px-4 text-sm",
        size === "lg" && "h-12 px-6 text-base",
        className,
      )}
      {...props}
    />
  );
}
