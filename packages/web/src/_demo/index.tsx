"use client";
import { createContext, useContext, useRef, type ReactNode, type RefObject } from "react";
import { cn } from "@kinetik/core";

/** Demo-only helpers. Not part of any registry item. */

export const photos = Array.from({ length: 8 }, (_, i) => `/demo/photo-${i + 1}.jpg`);
export const photoAlt = [
  "Coral dunes at dusk",
  "Indigo mountain ridge",
  "Neon city haze",
  "Emerald canopy",
  "Amber desert road",
  "Violet aurora sky",
  "Ocean glass at noon",
  "Rose quartz studio",
];

const ScrollerCtx = createContext<RefObject<HTMLDivElement | null> | null>(null);
export const useDemoScroller = () => useContext(ScrollerCtx);

/** A self-contained scroll viewport so scroll demos work inside preview frames. */
export function DemoScroller({ children, className, hint = true }: { children: ReactNode; className?: string; hint?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <ScrollerCtx.Provider value={ref}>
      <div ref={ref} data-lenis-prevent className={cn("relative h-full w-full overflow-y-auto overscroll-contain [container-type:size]", className)}>
        {hint && (
          <div className="pointer-events-none sticky top-3 z-20 mx-auto w-fit rounded-full border border-border bg-background/80 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
            Scroll inside ↓
          </div>
        )}
        {children}
      </div>
    </ScrollerCtx.Provider>
  );
}

export function DemoCenter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex h-full w-full flex-wrap items-center justify-center gap-4 p-6", className)}>{children}</div>;
}
