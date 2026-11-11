"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface MediaAmbientGlowProps {
  /** An image URL or a playing <video> element's src. */
  src: string;
  kind?: "image" | "video";
  /** Glow strength 0–1. */
  intensity?: number;
  className?: string;
  children?: ReactNode;
}

/**
 * YouTube-style "ambient mode": the media is drawn into a tiny canvas behind itself, scaled up and
 * blurred, so its own colours spill around the frame. For video the glow resamples a few times per
 * second (cheap — a 32×18 canvas); images sample once.
 */
export function MediaAmbientGlow({ src, kind = "image", intensity = 0.8, className, children }: MediaAmbientGlowProps) {
  const reduced = useReducedMotion();
  const canvas = useRef<HTMLCanvasElement>(null);
  const media = useRef<HTMLImageElement & HTMLVideoElement>(null);

  useEffect(() => {
    const c = canvas.current, m = media.current;
    const ctx = c?.getContext("2d");
    if (!c || !m || !ctx) return;
    const draw = () => {
      try {
        ctx.drawImage(m, 0, 0, c.width, c.height);
      } catch {
        /* not ready or cross-origin */
      }
    };
    if (kind === "image") {
      if ((m as HTMLImageElement).complete) draw();
      m.addEventListener("load", draw);
      return () => m.removeEventListener("load", draw);
    }
    // video: resample at ~6 fps; a crossfade via CSS transition smooths the steps
    draw();
    if (reduced) return;
    const id = setInterval(draw, 160);
    return () => clearInterval(id);
  }, [src, kind, reduced]);

  return (
    <div className={cn("relative isolate", className)}>
      <canvas
        ref={canvas}
        width={32}
        height={18}
        aria-hidden
        className="absolute inset-0 -z-10 size-full scale-110 blur-3xl saturate-150 transition-opacity duration-700"
        style={{ opacity: intensity }}
      />
      {kind === "video" ? (
        <video ref={media} src={src} autoPlay={!reduced} muted loop playsInline crossOrigin="anonymous" className="relative block size-full rounded-2xl object-cover" />
      ) : (
        <img ref={media} src={src} alt="" crossOrigin="anonymous" className="relative block size-full rounded-2xl object-cover" />
      )}
      {children}
    </div>
  );
}
