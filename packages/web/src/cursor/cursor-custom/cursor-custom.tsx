"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn, usePrefersTouch, useReducedMotion } from "@kinetik/core";

/**
 * Dot + lagging ring cursor scoped to its children. Elements can opt into states:
 * `data-cursor="link"` grows the ring, `data-cursor="view"` shows a "View" label, `data-cursor-text="Drag"` any label.
 */
export function CursorCustom({ children, className }: { children: ReactNode; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });
  const [state, setState] = useState<{ kind: string; text?: string }>({ kind: "default" });
  const [inside, setInside] = useState(false);
  const off = useReducedMotion() || usePrefersTouch();

  useEffect(() => {
    const el = box.current;
    if (!el || off) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor],[data-cursor-text],a,button");
      setState(t ? { kind: t.dataset.cursor ?? (t.dataset.cursorText ? "text" : "link"), text: t.dataset.cursorText } : { kind: "default" });
    };
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, [off, x, y]);

  const big = state.kind === "view" || state.kind === "text";
  return (
    <div ref={box} onPointerEnter={() => setInside(true)} onPointerLeave={() => setInside(false)} className={cn("relative", !off && "cursor-none [&_*]:cursor-none", className)}>
      {children}
      {!off && (
        <>
          <motion.div aria-hidden className="pointer-events-none absolute top-0 left-0 z-50 size-1.5 rounded-full bg-foreground" style={{ x, y, translateX: "-50%", translateY: "-50%" }} animate={{ opacity: inside && !big ? 1 : 0 }} />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 z-50 grid place-items-center rounded-full border border-foreground/60 text-[11px] font-medium mix-blend-difference"
            style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
            animate={{ width: big ? 72 : state.kind === "link" ? 48 : 30, height: big ? 72 : state.kind === "link" ? 48 : 30, opacity: inside ? 1 : 0, backgroundColor: big ? "rgb(255 255 255)" : "rgb(255 255 255 / 0)" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {big && <span className="text-black">{state.text ?? "View"}</span>}
          </motion.div>
        </>
      )}
    </div>
  );
}
