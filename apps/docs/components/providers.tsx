"use client";
import { MotionConfig } from "motion/react";
import { useReducedMotion } from "@kinetik/core";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return <MotionConfig reducedMotion={reduced ? "always" : "never"}>{children}</MotionConfig>;
}
