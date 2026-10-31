"use client";
import { useRef, type ReactNode } from "react";
import { cn, usePrefersTouch, useReducedMotion } from "@kinetik/core";

/** Holographic foil card: rainbow sheen, sparkle texture and glare all track the pointer through CSS variables. */
export function CardHolo({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const off = useReducedMotion() || usePrefersTouch();
  const move = (e: React.PointerEvent) => {
    if (off || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const s = ref.current.style;
    s.setProperty("--mx", `${x * 100}%`);
    s.setProperty("--my", `${y * 100}%`);
    s.setProperty("--rx", `${(0.5 - y) * 18}deg`);
    s.setProperty("--ry", `${(x - 0.5) * 22}deg`);
    s.setProperty("--o", "1");
  };
  const leave = () => {
    const s = ref.current?.style;
    s?.setProperty("--rx", "0deg");
    s?.setProperty("--ry", "0deg");
    s?.setProperty("--o", "0");
  };
  return (
    <div className="[perspective:900px]">
      <div
        ref={ref}
        onPointerMove={move}
        onPointerLeave={leave}
        className={cn("relative overflow-hidden rounded-2xl transition-transform duration-300 ease-out [transform:rotateX(var(--rx,0))_rotateY(var(--ry,0))] [transform-style:preserve-3d]", className)}
      >
        {children}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-color-dodge transition-opacity duration-300"
          style={{
            opacity: "calc(var(--o, 0) * .75)",
            background: "repeating-linear-gradient(115deg, #ff7eb3 0%, #ffd36e 8%, #8bffb0 16%, #6ec8ff 24%, #c58bff 32%, #ff7eb3 40%)",
            backgroundSize: "300% 300%",
            backgroundPosition: "var(--mx, 50%) var(--my, 50%)",
            maskImage: "radial-gradient(circle at var(--mx,50%) var(--my,50%), #000 0%, transparent 70%)",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 transition-opacity duration-300" style={{ opacity: "var(--o, 0)", background: "radial-gradient(circle at var(--mx,50%) var(--my,50%), rgb(255 255 255 / .45), transparent 45%)", mixBlendMode: "overlay" }} />
      </div>
    </div>
  );
}
