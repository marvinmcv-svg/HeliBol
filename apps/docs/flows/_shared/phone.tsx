"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { LayoutGroup } from "motion/react";
import { cn } from "@kinetik/core";

const W = 320;
const H = 660;

/** iPhone-style frame (320×660 logical) that scales to fit its container. */
export function Phone({ children, className, dark = false }: { children: ReactNode; className?: string; dark?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const group = useId();
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1, (e.contentRect.height - 24) / H, (e.contentRect.width - 24) / W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box} className={cn("grid h-full w-full place-items-center overflow-hidden", className)}>
      <div style={{ width: W * scale, height: H * scale }}>
        <div
          className={cn("relative origin-top-left overflow-hidden rounded-[48px] border-[10px] border-zinc-900 shadow-[0_30px_80px_-20px_rgb(0_0_0/.5)] ring-1 ring-zinc-700", dark ? "bg-zinc-950 text-white" : "bg-white text-zinc-900")}
          style={{ width: W, height: H, transform: `scale(${scale})` }}
        >
          <div className="pointer-events-none absolute top-0 z-50 flex h-11 w-full items-center justify-between px-7 text-[12px] font-semibold">
            <span>9:41</span>
            <span className="absolute top-2.5 left-1/2 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black" />
            <span className="flex items-center gap-1">
              <svg viewBox="0 0 18 12" className="h-2.5 w-4" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5" width="3" height="7" rx="1" /><rect x="10" y="2.5" width="3" height="9.5" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
              <span className="inline-block h-2.5 w-5 rounded-[3px] border border-current p-px"><span className="block h-full w-3/4 rounded-[1px] bg-current" /></span>
            </span>
          </div>
          <div className="relative h-full w-full">
            {/* isolate layoutIds so several phones can render the same flow side by side */}
            <LayoutGroup id={group}>{children}</LayoutGroup>
          </div>
          <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-50 h-1 w-28 -translate-x-1/2 rounded-full bg-current opacity-40" />
        </div>
      </div>
    </div>
  );
}

/** Web stand-in for expo-haptics so prototypes can show where haptics fire. */
export function haptic(kind: "light" | "medium" | "success" | "error" = "light") {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(kind === "success" ? [10, 40, 10] : kind === "error" ? [30, 30, 30] : kind === "medium" ? 15 : 8);
}
