"use client";
import { useRef, useState } from "react";
import { cn, useReducedMotion } from "@kinetik/core";

/** Card that plays a muted preview on hover/focus (or a Ken Burns pan when there's no video), pausing and rewinding on leave. */
export function VideoHover({ poster, src, title, meta, className }: { poster: string; src?: string; title: string; meta?: string; className?: string }) {
  const v = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);
  const reduced = useReducedMotion();
  const start = () => {
    setOn(true);
    if (!reduced) v.current?.play().catch(() => {});
  };
  const stop = () => {
    setOn(false);
    if (v.current) (v.current.pause(), (v.current.currentTime = 0));
  };
  return (
    <a href="#" onPointerEnter={start} onPointerLeave={stop} onFocus={start} onBlur={stop} className={cn("group block overflow-hidden rounded-2xl border border-border bg-card outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}>
      <div className="relative aspect-video overflow-hidden">
        {src ? <video ref={v} src={src} poster={poster} muted loop playsInline preload="none" className="h-full w-full object-cover" /> : <img src={poster} alt="" className={cn("h-full w-full object-cover transition-transform duration-[4s] ease-linear", on && !reduced && "scale-125 -translate-x-[6%]")} />}
        <span className={cn("absolute right-2 bottom-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white transition-opacity", on && "opacity-0")}>2:14</span>
        <span className={cn("absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-red-500 transition-transform duration-[4s] ease-linear", on && "scale-x-100")} />
      </div>
      <div className="p-3"><p className="text-sm font-medium">{title}</p>{meta && <p className="text-xs text-muted-foreground">{meta}</p>}</div>
    </a>
  );
}
