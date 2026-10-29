"use client";
import { useRef, type ElementType, type ReactNode } from "react";
import { cn, useInView } from "@kinetik/core";

export type RevealVariant = "fade-up" | "fade" | "scale" | "blur" | "slide-left" | "slide-right";

export interface ScrollRevealProps {
  children: ReactNode;
  as?: ElementType;
  variant?: RevealVariant;
  /** Stagger index × 80ms delay for the IntersectionObserver fallback. */
  index?: number;
  className?: string;
}

/*
 * Scroll-driven (CSS animation-timeline: view()) where supported — runs off the main thread
 * and is scrubbed by scroll. Elsewhere, an IntersectionObserver toggles a transition.
 */
const css = `
.k-reveal{--k-from-t:translateY(32px);--k-from-s:1;--k-from-b:0px}
.k-reveal[data-variant=fade]{--k-from-t:none}
.k-reveal[data-variant=scale]{--k-from-t:none;--k-from-s:.88}
.k-reveal[data-variant=blur]{--k-from-t:translateY(12px);--k-from-b:10px}
.k-reveal[data-variant=slide-left]{--k-from-t:translateX(-48px)}
.k-reveal[data-variant=slide-right]{--k-from-t:translateX(48px)}
@keyframes k-reveal{from{opacity:0;transform:var(--k-from-t) scale(var(--k-from-s));filter:blur(var(--k-from-b))}}
@supports (animation-timeline: view()){
  .k-reveal{animation:k-reveal linear both;animation-timeline:view();animation-range:entry 5% cover 35%}
}
@supports not (animation-timeline: view()){
  .k-reveal{opacity:0;transform:var(--k-from-t) scale(var(--k-from-s));filter:blur(var(--k-from-b));transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1),filter .7s cubic-bezier(.16,1,.3,1);transition-delay:var(--k-delay)}
  .k-reveal[data-in]{opacity:1;transform:none;filter:none}
}
@media (prefers-reduced-motion:reduce){.k-reveal{animation:none!important;transform:none!important;filter:none!important;opacity:1!important}}
[data-reduce-motion] .k-reveal{animation:none!important;transform:none!important;filter:none!important;opacity:1!important}`;

export function ScrollReveal({ children, as: Tag = "div", variant = "fade-up", index = 0, className }: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.15 });
  return (
    <>
      <style href="k-reveal" precedence="kinetik">{css}</style>
      <Tag
        ref={ref}
        data-variant={variant}
        data-in={inView ? "" : undefined}
        className={cn("k-reveal", className)}
        style={{ "--k-delay": `${index * 80}ms` } as React.CSSProperties}
      >
        {children}
      </Tag>
    </>
  );
}
