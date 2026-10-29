"use client";
import { Suspense, useRef, useState, useEffect, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { cn, usePageVisible, useReducedMotion } from "@kinetik/core";

export interface Canvas3DShellProps {
  children: ReactNode;
  className?: string;
  /** Max device pixel ratio (clamped for performance). */
  maxDpr?: number;
  camera?: { position?: [number, number, number]; fov?: number };
  fallback?: ReactNode;
}

/**
 * Production wrapper for React Three Fiber: lazy-mountable, DPR clamped, renders only while
 * on-screen and the tab is visible ("demand" frameloop otherwise), static under reduced motion.
 * Load it with next/dynamic or React.lazy so three.js never lands in your main bundle.
 */
export function Canvas3DShell({ children, className, maxDpr = 2, camera = { position: [0, 0, 5], fov: 45 }, fallback }: Canvas3DShellProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);
  const visible = usePageVisible();
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const active = onScreen && visible && !reduced;
  return (
    <div ref={ref} className={cn("relative h-full w-full", className)}>
      <Suspense fallback={fallback ?? null}>
        <Canvas dpr={[1, maxDpr]} camera={camera} frameloop={active ? "always" : "demand"} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
          {children}
        </Canvas>
      </Suspense>
    </div>
  );
}
