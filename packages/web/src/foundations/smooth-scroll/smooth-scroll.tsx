"use client";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);
/** Access the Lenis instance, e.g. `useLenis()?.scrollTo("#pricing")`. */
export const useLenis = () => useContext(LenisContext);

export interface SmoothScrollProps {
  children: ReactNode;
  /** Scroll a wrapper element instead of the window (wrapper = this component's root). */
  contained?: boolean;
  /** 0–1, lower = smoother/heavier. */
  lerp?: number;
  /** Keep native touch scrolling on phones (recommended). */
  syncTouch?: boolean;
  className?: string;
}

/** Lenis smooth scrolling synced to GSAP's ticker so ScrollTrigger stays frame-perfect. */
export function SmoothScroll({ children, contained = false, lerp = 0.09, syncTouch = false, className }: SmoothScrollProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;
    const instance = new Lenis({
      lerp,
      syncTouch,
      anchors: true,
      autoRaf: false,
      ...(contained && wrapper.current && content.current ? { wrapper: wrapper.current, content: content.current } : {}),
    });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced, lerp, syncTouch, contained]);

  return (
    <LenisContext.Provider value={lenis}>
      {contained ? (
        <div ref={wrapper} className={cn("h-full overflow-y-auto", className)}>
          <div ref={content}>{children}</div>
        </div>
      ) : (
        children
      )}
    </LenisContext.Provider>
  );
}

export type { RefObject };
