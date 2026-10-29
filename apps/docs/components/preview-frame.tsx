"use client";
import { useState } from "react";
import { Monitor, RotateCcw, Smartphone, Tablet, Maximize2 } from "lucide-react";
import { cn, useReplayKey } from "@kinetik/core";
import { LazyDemo } from "./lazy-demo";
import { ReduceMotionToggle } from "./reduce-motion-toggle";

const viewports = [
  { id: "desktop", icon: Monitor, width: "100%" },
  { id: "tablet", icon: Tablet, width: "768px" },
  { id: "mobile", icon: Smartphone, width: "390px" },
] as const;

export function PreviewFrame({ id, height = 360, className }: { id: string; height?: number; className?: string }) {
  const [key, replay] = useReplayKey();
  const [vp, setVp] = useState<(typeof viewports)[number]["id"]>("desktop");
  const [full, setFull] = useState(false);
  const width = viewports.find((v) => v.id === vp)!.width;

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-card", full && "fixed inset-2 z-50 !m-0 flex flex-col shadow-2xl", className)}>
      <div className="flex items-center gap-1 border-b border-border px-2 py-1.5">
        <div className="flex items-center rounded-lg bg-muted p-0.5">
          {viewports.map((v) => (
            <button
              key={v.id}
              onClick={() => setVp(v.id)}
              aria-label={`${v.id} viewport`}
              aria-pressed={vp === v.id}
              className={cn("grid size-7 place-items-center rounded-md text-muted-foreground transition-colors", vp === v.id && "bg-background text-foreground shadow-sm")}
            >
              <v.icon className="size-3.5" />
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1">
          <ReduceMotionToggle label />
          <button onClick={replay} className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
            <RotateCcw className="size-3.5" /> Replay
          </button>
          <button onClick={() => setFull((f) => !f)} aria-label="Toggle fullscreen" className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground">
            <Maximize2 className="size-3.5" />
          </button>
        </div>
      </div>
      <div
        className={cn("relative flex justify-center bg-[radial-gradient(circle_at_1px_1px,color-mix(in_oklab,var(--foreground)_9%,transparent)_1px,transparent_0)] [background-size:18px_18px]", full && "flex-1")}
        style={full ? undefined : { height }}
      >
        <div className="relative h-full overflow-hidden bg-background transition-[width] duration-500 ease-[cubic-bezier(.16,1,.3,1)]" style={{ width, maxWidth: "100%", contain: "paint" }}>
          <LazyDemo key={`${id}-${key}`} id={id} eager />
        </div>
      </div>
    </div>
  );
}
