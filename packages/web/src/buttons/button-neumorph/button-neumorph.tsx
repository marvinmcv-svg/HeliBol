"use client";
import { useState, type ReactNode } from "react";
import { cn } from "@kinetik/core";

/** Soft-UI toggle button: raised when off, pressed into the surface when on, with an eased inner-shadow swap. */
export function ButtonNeumorph({ children, defaultPressed = false, onPressedChange, className }: { children: ReactNode; defaultPressed?: boolean; onPressedChange?: (p: boolean) => void; className?: string }) {
  const [pressed, setPressed] = useState(defaultPressed);
  return (
    <button
      aria-pressed={pressed}
      onClick={() => {
        setPressed(!pressed);
        onPressedChange?.(!pressed);
      }}
      className={cn(
        "grid size-20 place-items-center rounded-3xl bg-[#e6e9ef] text-zinc-500 outline-none transition-[box-shadow,color] duration-300 motion-reduce:transition-none ease-[cubic-bezier(.2,0,0,1)] focus-visible:ring-2 focus-visible:ring-ring",
        pressed ? "text-violet-600 shadow-[inset_6px_6px_12px_#c5c8ce,inset_-6px_-6px_12px_#ffffff]" : "shadow-[8px_8px_16px_#c5c8ce,-8px_-8px_16px_#ffffff]",
        className,
      )}
    >
      <span className={cn("transition-transform duration-300 [&>svg]:size-7", pressed && "scale-90")}>{children}</span>
    </button>
  );
}
