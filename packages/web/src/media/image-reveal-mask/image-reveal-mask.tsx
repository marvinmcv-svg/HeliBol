"use client";
import { useRef } from "react";
import { cn, useInView } from "@kinetik/core";

export interface ImageRevealMaskProps {
  src: string;
  alt: string;
  direction?: "up" | "left" | "center" | "diagonal";
  delay?: number;
  className?: string;
}

const css = `
.k-imgrev{clip-path:var(--k-from);transition:clip-path 1.1s cubic-bezier(.77,0,.18,1) var(--k-delay)}
.k-imgrev img{scale:1.25;transition:scale 1.6s cubic-bezier(.16,1,.3,1) var(--k-delay)}
.k-imgrev[data-in]{clip-path:inset(0 0 0 0)}
.k-imgrev[data-in] img{scale:1}
@media (prefers-reduced-motion:reduce){.k-imgrev,.k-imgrev img{transition:none;clip-path:none;scale:1}}
[data-reduce-motion] .k-imgrev,[data-reduce-motion] .k-imgrev img{transition:none!important;clip-path:none!important;scale:1!important}`;

const from = {
  up: "inset(100% 0 0 0)",
  left: "inset(0 100% 0 0)",
  center: "inset(50% 50% 50% 50% round 24px)",
  diagonal: "polygon(0 0, 0 0, 0 0, 0 0)",
};

export function ImageRevealMask({ src, alt, direction = "up", delay = 0, className }: ImageRevealMaskProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const fromValue = direction === "diagonal" ? from.diagonal : from[direction];
  return (
    <div
      ref={ref}
      data-in={inView ? "" : undefined}
      className={cn("k-imgrev overflow-hidden", className)}
      style={{ "--k-from": fromValue, "--k-delay": `${delay}s`, ...(direction === "diagonal" && inView ? { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" } : {}) } as React.CSSProperties}
    >
      <style href="k-imgrev" precedence="kinetik">{css}</style>
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}
