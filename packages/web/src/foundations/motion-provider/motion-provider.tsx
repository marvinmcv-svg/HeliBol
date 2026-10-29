"use client";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import type { ReactNode } from "react";
import { useReducedMotion } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface MotionProviderProps {
  children: ReactNode;
  /** Default transition for every motion component. */
  transition?: object;
  /** Strict LazyMotion: forces `m.*` components (4.6 KB instead of ~34 KB). */
  strict?: boolean;
}

/**
 * Root motion provider: shared default spring, reduced-motion wiring (OS setting or <html data-reduce-motion>)
 * and LazyMotion feature loading.
 */
export function MotionProvider({ children, transition = spring.smooth, strict = false }: MotionProviderProps) {
  const reduced = useReducedMotion();
  return (
    <LazyMotion features={domAnimation} strict={strict}>
      <MotionConfig transition={transition} reducedMotion={reduced ? "always" : "never"}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
