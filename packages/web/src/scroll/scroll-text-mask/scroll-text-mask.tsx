"use client";
import { useId, useRef, type ReactNode, type RefObject } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface ScrollTextMaskProps {
  /** Word(s) the image shows through. Short and heavy works best. */
  text: string;
  image: string;
  /** Content revealed after the mask opens. */
  children?: ReactNode;
  container?: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * Giant knockout type as a window: the photo shows only through the letters, then as you scroll the
 * type scales up ~40× from a point inside a letter until the image fills the screen and the
 * follow-up content fades in. The mask is real SVG text, so it stays crisp at any scale.
 */
export function ScrollTextMask({ text, image, children, container, className }: ScrollTextMaskProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const maskId = `kn-tm-${useId().replace(/:/g, "")}`;
  const { scrollYProgress: p } = useScroll({ target: ref, container, offset: ["start start", "end end"] });
  const scale = useTransform(p, [0, 0.75], [1, 42], { clamp: true });
  const imgScale = useTransform(p, [0, 0.75], [1.35, 1]);
  const after = useTransform(p, [0.7, 0.9], [0, 1]);
  const veil = useTransform(p, [0, 0.6], [1, 0]);
  // safety net: if the zoom origin lands between letters, the sheet still fades away
  const sheet = useTransform(p, [0.55, 0.78], [1, 0]);

  if (reduced)
    return (
      <div ref={ref} className={cn("relative h-[100cqh] overflow-hidden", className)}>
        <img src={image} alt="" className="size-full object-cover" />
        <div className="absolute inset-0 grid place-items-center bg-black/40 p-6 text-white">{children ?? <h3 className="text-5xl font-black">{text}</h3>}</div>
      </div>
    );

  return (
    <div ref={ref} className={cn("relative h-[280cqh]", className)}>
      <div className="sticky top-0 h-[100cqh] overflow-hidden bg-background">
        <div className="absolute inset-0">
          <motion.img src={image} alt="" className="absolute inset-0 size-full object-cover" style={{ scale: imgScale }} />
        </div>
        {/* mask: background-coloured sheet with the word cut out, scaled from a point inside the first letter */}
        <motion.svg aria-hidden viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" style={{ scale, opacity: sheet, transformOrigin: "47% 52%" }}>
          <defs>
            <mask id={maskId}>
              <rect width="1000" height="600" fill="white" />
              <text x="500" y="375" textAnchor="middle" fontSize="300" fontWeight="900" letterSpacing="-14" fill="black" fontFamily="inherit">{text}</text>
            </mask>
          </defs>
          <rect width="1000" height="600" mask={`url(#${maskId})`} className="fill-background" />
        </motion.svg>
        <motion.p style={{ opacity: veil }} className="absolute inset-x-0 bottom-8 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">Scroll to step inside</motion.p>
        <motion.div style={{ opacity: after }} className="absolute inset-0 grid place-items-center bg-black/35 p-6 text-center text-white">
          {children}
        </motion.div>
      </div>
      <span className="sr-only">{text}</span>
    </div>
  );
}
