"use client";
import { useRef, type ElementType } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(ScrambleTextPlugin, useGSAP);

export interface TextScrambleProps {
  children: string;
  as?: ElementType;
  /** When to scramble: on mount, on hover/focus, or both. */
  trigger?: "mount" | "hover" | "both";
  chars?: string;
  duration?: number;
  className?: string;
}

export function TextScramble({
  children,
  as: Tag = "span",
  trigger = "both",
  chars = "upperCase",
  duration = 1.1,
  className,
}: TextScrambleProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { contextSafe } = useGSAP(
    () => {
      if (reduced || trigger === "hover") return;
      gsap.from(ref.current, { duration, scrambleText: { text: children, chars, speed: 0.6, revealDelay: 0.2 } });
    },
    { scope: ref, dependencies: [children, reduced] },
  );

  const play = contextSafe(() => {
    if (reduced || trigger === "mount" || !ref.current) return;
    gsap.to(ref.current, { duration: duration * 0.7, overwrite: true, scrambleText: { text: children, chars, speed: 0.8 } });
  });

  return (
    <Tag
      ref={ref}
      aria-label={children}
      onPointerEnter={play}
      onFocus={play}
      className={cn("inline-block tabular-nums", className)}
    >
      {children}
    </Tag>
  );
}
