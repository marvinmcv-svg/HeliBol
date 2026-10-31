"use client";
import { createContext, useContext, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { cn, usePrefersTouch, useReducedMotion } from "@kinetik/core";

const Ctx = createContext<{ hover: MotionValue<number> } | null>(null);

/** 3D card where child layers pop out at different depths (translateZ) as the card tilts toward the pointer. */
export function Card3D({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const off = useReducedMotion() || usePrefersTouch();
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const hover = useSpring(useMotionValue(0), { stiffness: 200, damping: 25 });
  return (
    <Ctx.Provider value={{ hover }}>
      <div className="[perspective:1000px]">
        <motion.div
          ref={ref}
          onPointerMove={(e) => {
            if (off || !ref.current) return;
            const r = ref.current.getBoundingClientRect();
            ry.set(((e.clientX - r.left) / r.width - 0.5) * 24);
            rx.set(-((e.clientY - r.top) / r.height - 0.5) * 24);
            hover.set(1);
          }}
          onPointerLeave={() => (rx.set(0), ry.set(0), hover.set(0))}
          style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
          className={cn("relative", className)}
        >
          {children}
        </motion.div>
      </div>
    </Ctx.Provider>
  );
}

/** A layer inside <Card3D>; `depth` (px) is how far it lifts toward the viewer on hover. */
export function Card3DLayer({ depth = 40, children, className }: { depth?: number; children: ReactNode; className?: string }) {
  const ctx = useContext(Ctx);
  const fallback = useMotionValue(0);
  const z = useTransform(ctx?.hover ?? fallback, [0, 1], [0, depth]);
  return <motion.div style={{ translateZ: z, transformStyle: "preserve-3d" }} className={className}>{children}</motion.div>;
}
