"use client";
import { useRef, type ElementType } from "react";
import { cn, usePrefersTouch, useRafLoop, useReducedMotion } from "@kinetik/core";

export interface TextVariableProximityProps {
  children: string;
  as?: ElementType;
  /** influence radius in px */
  radius?: number;
  minWeight?: number;
  maxWeight?: number;
  className?: string;
}

/** Letters thicken (variable-font weight) and lift as the cursor approaches them. */
export function TextVariableProximity({ children, as: Tag = "p", radius = 140, minWeight = 200, maxWeight = 900, className }: TextVariableProximityProps) {
  const root = useRef<HTMLElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const off = useReducedMotion() || usePrefersTouch();

  useRafLoop(() => {
    const el = root.current;
    if (!el) return;
    for (const span of el.querySelectorAll<HTMLElement>("[data-ch]")) {
      const r = span.getBoundingClientRect();
      const d = Math.hypot(mouse.current.x - (r.left + r.width / 2), mouse.current.y - (r.top + r.height / 2));
      const t = Math.max(0, 1 - d / radius);
      const w = minWeight + (maxWeight - minWeight) * t * t;
      span.style.fontVariationSettings = `"wght" ${w.toFixed(0)}`;
      span.style.translate = `0 ${(-t * 4).toFixed(2)}px`;
    }
  }, !off);

  return (
    <Tag
      ref={root}
      aria-label={children}
      onPointerMove={(e: React.PointerEvent) => (mouse.current = { x: e.clientX, y: e.clientY })}
      onPointerLeave={() => (mouse.current = { x: -9999, y: -9999 })}
      className={cn("cursor-default select-none", className)}
      style={{ fontVariationSettings: `"wght" ${minWeight}` }}
    >
      {Array.from(children).map((ch, i) => (
        <span key={i} data-ch aria-hidden className="inline-block whitespace-pre" style={{ fontVariationSettings: `"wght" ${minWeight}` }}>
          {ch}
        </span>
      ))}
    </Tag>
  );
}
