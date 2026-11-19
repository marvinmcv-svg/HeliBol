"use client";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface CardLensZoomProps {
  image: string;
  alt: string;
  /** Magnification inside the lens. */
  zoom?: number;
  /** Lens diameter in px. */
  size?: number;
  className?: string;
}

/**
 * Product-photo magnifier: a glass lens springs after the cursor and shows the image at `zoom`×
 * underneath it, with a subtle refraction rim. Scroll wheel over the lens changes the zoom.
 * Touch: press and drag. Reduced motion: lens follows without spring.
 */
export function CardLensZoom({ image, alt, zoom: initialZoom = 2.5, size = 160, className }: CardLensZoomProps) {
  const reduced = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [zoom, setZoom] = useState(initialZoom);
  const [dims, setDims] = useState({ w: 1, h: 1 });
  const x = useMotionValue(0), y = useMotionValue(0);
  const cfg = reduced ? { stiffness: 2000, damping: 100 } : { stiffness: 380, damping: 32, mass: 0.6 };
  const sx = useSpring(x, cfg), sy = useSpring(y, cfg);
  const bgX = useTransform(sx, (v) => `${-(v * zoom - size / 2)}px`);
  const bgY = useTransform(sy, (v) => `${-(v * zoom - size / 2)}px`);
  const left = useTransform(sx, (v) => v - size / 2);
  const top = useTransform(sy, (v) => v - size / 2);

  const track = (e: React.PointerEvent) => {
    const r = box.current!.getBoundingClientRect();
    setDims({ w: r.width, h: r.height });
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  return (
    <div
      ref={box}
      className={cn("relative aspect-[4/5] cursor-none touch-none overflow-hidden rounded-3xl bg-muted", className)}
      onPointerEnter={(e) => (track(e), e.pointerType !== "touch" && setActive(true))}
      onPointerDown={(e) => (track(e), setActive(true))}
      onPointerMove={track}
      onPointerUp={(e) => e.pointerType === "touch" && setActive(false)}
      onPointerLeave={() => setActive(false)}
      onWheel={(e) => active && setZoom((z) => Math.min(5, Math.max(1.5, z - e.deltaY * 0.004)))}
    >
      <img src={image} alt={alt} draggable={false} className="size-full object-cover" />
      <motion.div
        aria-hidden
        initial={false}
        animate={{ scale: active ? 1 : 0.2, opacity: active ? 1 : 0 }}
        transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 26 }}
        className="pointer-events-none absolute rounded-full shadow-[0_20px_50px_-10px_rgb(0_0_0/.55),inset_0_0_0_2px_rgb(255_255_255/.85),inset_0_0_24px_rgb(255_255_255/.35)]"
        style={{
          width: size,
          height: size,
          left,
          top,
          backgroundImage: `url(${image})`,
          backgroundSize: `${dims.w * zoom}px ${dims.h * zoom}px`,
          backgroundPositionX: bgX,
          backgroundPositionY: bgY,
          backgroundRepeat: "no-repeat",
        }}
      >
        <span className="absolute inset-x-6 top-3 h-6 rounded-full bg-gradient-to-b from-white/50 to-transparent blur-[2px]" />
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-white">{zoom.toFixed(1)}×</span>
      </motion.div>
    </div>
  );
}
