"use client";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { CustomWiggle } from "gsap/CustomWiggle";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(CustomEase, CustomWiggle, useGSAP);

export type WiggleKind = "ring" | "shake" | "jelly" | "nudge";

export interface GsapWiggleProps {
  children: ReactNode;
  kind?: WiggleKind;
  /** Wiggle on hover as well as on click/`trigger` changes. */
  onHover?: boolean;
  /** Change this value to fire the wiggle programmatically (e.g. on validation error). */
  trigger?: unknown;
  className?: string;
}

const KINDS: Record<WiggleKind, (el: Element) => gsap.core.Tween | gsap.core.Timeline> = {
  // bell: rotation pivots from the top, decaying "easeOut" wiggle
  ring: (el) => gsap.fromTo(el, { rotation: 0 }, { rotation: 22, transformOrigin: "50% 8%", duration: 1, ease: CustomWiggle.create("kRing", { wiggles: 7, type: "easeOut" }) }),
  // error shake: x only, uniform intensity
  shake: (el) => gsap.fromTo(el, { x: 0 }, { x: 10, duration: 0.5, ease: CustomWiggle.create("kShake", { wiggles: 6, type: "uniform" }) }),
  // jelly: squash & stretch on two axes with offset timing
  jelly: (el) =>
    gsap
      .timeline()
      .fromTo(el, { scaleX: 1 }, { scaleX: 1.25, duration: 0.8, ease: CustomWiggle.create("kJellyX", { wiggles: 4, type: "easeOut" }) }, 0)
      .fromTo(el, { scaleY: 1 }, { scaleY: 0.8, duration: 0.8, ease: CustomWiggle.create("kJellyY", { wiggles: 4, type: "easeOut" }) }, 0.04),
  // nudge: small anticipation-y "look at me"
  nudge: (el) => gsap.fromTo(el, { y: 0 }, { y: -8, duration: 0.7, ease: CustomWiggle.create("kNudge", { wiggles: 3, type: "anticipate" }) }),
};

/**
 * Attention wiggles powered by CustomWiggle: a bell that rings, an error shake, a jelly
 * squash and a nudge — each one tween whose ease *is* the oscillation, so it always
 * returns exactly to rest. Fires on click, hover, or when `trigger` changes.
 */
export function GsapWiggle({ children, kind = "ring", onHover = false, trigger, className }: GsapWiggleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const first = useRef(true);

  const { contextSafe } = useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      play();
    },
    { scope: ref, dependencies: [trigger] },
  );

  const play = contextSafe(() => {
    if (!ref.current) return;
    if (reduced) {
      gsap.fromTo(ref.current, { opacity: 0.4 }, { opacity: 1, duration: 0.3 });
      return;
    }
    gsap.killTweensOf(ref.current);
    KINDS[kind](ref.current);
  });

  return (
    <span ref={ref} onClick={play} onPointerEnter={onHover ? play : undefined} className={cn("inline-block will-change-transform", className)}>
      {children}
    </span>
  );
}
