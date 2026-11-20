"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn, usePrefersTouch, useReducedMotion } from "@kinetik/core";

export interface CursorFlashlightProps {
  /** What you see in the dark. */
  children: ReactNode;
  /** What the light reveals (rendered underneath, aligned with children). */
  reveal: ReactNode;
  /** Beam radius in px. */
  radius?: number;
  className?: string;
}

/**
 * X-ray flashlight: a dark top layer has a soft circular hole (CSS mask driven by custom
 * properties) that trails the pointer with easing, revealing a second layer underneath — hidden
 * messages, blueprints, before/after. Click to widen the beam. Touch and reduced motion also get a
 * Reveal toggle; under reduced motion the beam is a still spot. Before the pointer arrives the beam idles on a slow
 * Lissajous path (paused while off-screen).
 */
export function CursorFlashlight({ children, reveal, radius = 110, className }: CursorFlashlightProps) {
  const reduced = useReducedMotion();
  const touch = usePrefersTouch();
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = top.current;
    const host = el?.parentElement;
    if (!el || !host || reduced) return;
    // Until the pointer arrives (and after it leaves) the beam idles along a slow Lissajous path,
    // so the effect reads at a glance in galleries and on load.
    let idle = true;
    const b0 = host.getBoundingClientRect();
    const cur = { x: b0.width / 2, y: b0.height / 2, r: 0 }, tgt = { x: cur.x, y: cur.y, r: radius * 0.9 };
    let raf = 0;
    const tick = (now: number) => {
      if (idle) {
        const b = host.getBoundingClientRect();
        tgt.x = b.width * (0.5 + Math.cos(now * 0.00055) * 0.3);
        tgt.y = b.height * (0.5 + Math.sin(now * 0.0009) * 0.22);
      }
      const k = idle ? 0.06 : 0.18;
      cur.x += (tgt.x - cur.x) * k;
      cur.y += (tgt.y - cur.y) * k;
      cur.r += (tgt.r - cur.r) * 0.12;
      el.style.setProperty("--fx", `${cur.x}px`);
      el.style.setProperty("--fy", `${cur.y}px`);
      el.style.setProperty("--fr", `${cur.r}px`);
      raf = (idle && visible) || Math.abs(tgt.x - cur.x) + Math.abs(tgt.y - cur.y) + Math.abs(tgt.r - cur.r) > 0.3 ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => (raf ||= requestAnimationFrame(tick));
    let visible = false;
    const io = new IntersectionObserver(([e]) => ((visible = !!e?.isIntersecting), visible && kick()));
    io.observe(host);
    const move = (e: PointerEvent) => {
      const b = host.getBoundingClientRect();
      idle = false;
      tgt.x = e.clientX - b.left;
      tgt.y = e.clientY - b.top;
      kick();
    };
    const leave = () => ((idle = true), (tgt.r = radius * 0.9), kick());
    const enter = () => ((tgt.r = radius), kick());
    const down = () => ((tgt.r = radius * 2.2), kick());
    const up = () => ((tgt.r = radius), kick());
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    host.addEventListener("pointerenter", enter);
    host.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointerenter", enter);
      host.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [radius, reduced]);

  const mask = "radial-gradient(circle var(--fr, 0px) at var(--fx, -999px) var(--fy, -999px), transparent 0%, transparent 70%, #000 100%)";
  const fallback = touch || reduced;
  return (
    <div className={cn("group/fl relative isolate overflow-hidden", className)}>
      <div className="absolute inset-0">{reveal}</div>
      <div
        ref={top}
        className={cn("relative h-full", fallback && "transition-opacity duration-300 group-has-[[data-fl-on]]/fl:opacity-0")}
        style={{ WebkitMaskImage: mask, maskImage: mask, ...(reduced && ({ "--fx": "62%", "--fy": "45%", "--fr": `${radius}px` } as CSSProperties)) }}
      >
        {children}
      </div>
      {fallback && <FallbackToggle />}
    </div>
  );
}

function FallbackToggle() {
  return (
    <button
      type="button"
      onClick={(e) => (e.currentTarget.toggleAttribute("data-fl-on"), e.currentTarget.setAttribute("aria-pressed", String(e.currentTarget.hasAttribute("data-fl-on"))))}
      aria-pressed="false"
      className="absolute bottom-3 right-3 z-10 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-black"
    >
      Reveal
    </button>
  );
}
