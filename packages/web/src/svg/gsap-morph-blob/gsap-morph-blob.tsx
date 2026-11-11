"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(MorphSVGPlugin, useGSAP);

export interface MorphShape {
  label: string;
  /** Path data in a 0..200 viewBox. Any number of points — MorphSVG matches them. */
  d: string;
  color: string;
}

export interface GsapMorphBlobProps {
  shapes?: MorphShape[];
  /** Seconds per shape when autoplaying (0 = manual only). */
  interval?: number;
  className?: string;
}

const DEFAULT_SHAPES: MorphShape[] = [
  { label: "Blob", color: "#8b5cf6", d: "M100,18 C146,18 182,52 182,98 C182,146 150,182 102,182 C52,182 18,150 18,102 C18,54 56,18 100,18 Z" },
  { label: "Star", color: "#f59e0b", d: "M100,12 L124,72 L188,76 L138,116 L156,180 L100,144 L44,180 L62,116 L12,76 L76,72 Z" },
  { label: "Heart", color: "#ec4899", d: "M100,176 C40,132 14,100 14,66 C14,36 38,16 64,16 C82,16 94,26 100,40 C106,26 118,16 136,16 C162,16 186,36 186,66 C186,100 160,132 100,176 Z" },
  { label: "Bolt", color: "#22d3ee", d: "M116,10 L42,112 L94,112 L80,190 L158,82 L106,82 Z" },
  { label: "Drop", color: "#10b981", d: "M100,12 C130,62 168,98 168,132 C168,168 138,190 100,190 C62,190 32,168 32,132 C32,98 70,62 100,12 Z" },
];

/**
 * MorphSVGPlugin cycles one path through very different shapes (different point counts),
 * auto-matching points with `shapeIndex: "auto"` and a smooth `type: "rotational"` morph,
 * while the fill colour and a soft shadow follow along.
 */
export function GsapMorphBlob({ shapes = DEFAULT_SHAPES, interval = 2.2, className }: GsapMorphBlobProps) {
  const root = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  const { contextSafe } = useGSAP({ scope: root });

  const to = contextSafe((n: number) => {
    setI(n);
    const s = shapes[n];
    gsap.to(path.current, {
      morphSVG: { shape: s.d, type: "rotational", shapeIndex: "auto" },
      fill: s.color,
      duration: reduced ? 0 : 0.9,
      ease: "elastic.out(1, 0.6)",
      overwrite: true,
    });
  });

  useGSAP(
    () => {
      if (!interval || reduced) return;
      let n = 0;
      const id = setInterval(() => to((n = (n + 1) % shapes.length)), interval * 1000);
      return () => clearInterval(id);
    },
    { scope: root, dependencies: [interval, reduced, shapes.length] },
  );

  return (
    <div ref={root} className={cn("flex flex-col items-center gap-5", className)}>
      <svg viewBox="0 0 200 200" className="size-56 overflow-visible drop-shadow-[0_20px_40px_rgba(139,92,246,0.35)]" role="img" aria-label={shapes[i].label}>
        <path ref={path} d={shapes[0].d} fill={shapes[0].color} />
      </svg>
      <div className="flex flex-wrap justify-center gap-1.5">
        {shapes.map((s, n) => (
          <button key={s.label} onClick={() => to(n)} aria-pressed={i === n} className={cn("rounded-full border px-3 py-1 text-xs transition-colors", i === n ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground")}>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
