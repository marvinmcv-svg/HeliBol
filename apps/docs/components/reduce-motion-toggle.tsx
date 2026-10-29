"use client";
import { Accessibility } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

export function setReduceMotion(on: boolean) {
  const el = document.documentElement;
  if (on) el.setAttribute("data-reduce-motion", "");
  else el.removeAttribute("data-reduce-motion");
  try {
    localStorage.setItem("kinetik-reduce-motion", on ? "1" : "0");
  } catch {}
}

export function ReduceMotionToggle({ className, label = false }: { className?: string; label?: boolean }) {
  const reduced = useReducedMotion();
  return (
    <button
      type="button"
      aria-pressed={reduced}
      title="Preview reduced-motion fallbacks"
      onClick={() => setReduceMotion(!reduced)}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        reduced && "bg-brand/15 text-brand hover:bg-brand/20 hover:text-brand",
        className,
      )}
    >
      <Accessibility className="size-4" />
      <span className={cn(!label && "sr-only")}>Reduce motion</span>
    </button>
  );
}
