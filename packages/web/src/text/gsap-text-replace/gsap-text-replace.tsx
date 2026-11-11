"use client";
import { useRef } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(TextPlugin, useGSAP);

export interface GsapTextReplaceProps {
  /** Phrases to replace in turn. */
  phrases: string[];
  /** "char" types character by character; "word" swaps word by word. */
  mode?: "char" | "word";
  /** Seconds each phrase holds. */
  hold?: number;
  className?: string;
}

/**
 * Animated text replacement with GSAP's TextPlugin: the current phrase is rewritten into the next one
 * (by character or by word) with a highlight sweeping behind it, on a repeating timeline.
 */
export function GsapTextReplace({ phrases, mode = "char", hold = 1.6, className }: GsapTextReplaceProps) {
  const root = useRef<HTMLSpanElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const mark = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = text.current!;
      el.textContent = phrases[0];
      const tl = gsap.timeline({ repeat: -1 });
      phrases.forEach((_, i) => {
        const next = phrases[(i + 1) % phrases.length];
        if (reduced) {
          tl.to(el, { autoAlpha: 0, duration: 0.2, delay: hold }).set(el, { textContent: next }).to(el, { autoAlpha: 1, duration: 0.2 });
          return;
        }
        tl.to(mark.current, { scaleX: 1, transformOrigin: "left", duration: 0.35, ease: "power2.in", delay: hold })
          .to(el, { duration: mode === "char" ? Math.max(0.4, next.length * 0.035) : 0.6, text: { value: next, delimiter: mode === "word" ? " " : "" }, ease: "none" })
          .to(mark.current, { scaleX: 0, transformOrigin: "right", duration: 0.35, ease: "power2.out" });
      });
    },
    { scope: root, dependencies: [phrases.join("|"), mode, hold, reduced], revertOnUpdate: true },
  );

  return (
    <span ref={root} className={cn("relative inline-block", className)}>
      <span ref={mark} aria-hidden className="absolute -inset-x-1 inset-y-0 -z-10 scale-x-0 rounded bg-primary/20" />
      <span ref={text} aria-live="polite">{phrases[0]}</span>
    </span>
  );
}
