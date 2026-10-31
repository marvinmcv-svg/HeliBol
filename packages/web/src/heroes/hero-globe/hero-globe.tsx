"use client";
import { useMemo, useRef, type ReactNode } from "react";
import { cn, useCanvas } from "@kinetik/core";

export interface GlobeArc {
  from: [number, number];
  to: [number, number];
}

/** Dotted rotating globe on canvas (orthographic projection, no WebGL) with animated arcs between cities. Drag-free, pointer tilts it. */
export function HeroGlobe({ arcs = [], children, color = "139 92 246", className }: { arcs?: GlobeArc[]; children?: ReactNode; color?: string; className?: string }) {
  const tilt = useRef(0);
  const pts = useMemo(() => {
    const out: [number, number][] = [];
    const N = 1600;
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = i * 2.399963;
      // crude "land" mask so it reads as a planet, not a ball
      const lat = Math.asin(y);
      const lon = th % (Math.PI * 2);
      const land = Math.sin(lon * 3 + lat * 2) + Math.cos(lat * 4 - lon) > 0.35;
      if (land) out.push([Math.atan2(Math.sin(th) * r, Math.cos(th) * r), lat]);
    }
    return out;
  }, []);
  const ref = useCanvas(({ ctx, width, height, time, pointer }) => {
    ctx.clearRect(0, 0, width, height);
    const R = Math.min(width, height) * 0.42;
    const cx = width / 2;
    const cy = height / 2;
    const rot = time * 0.25;
    if (pointer) tilt.current += ((pointer.y / height - 0.5) * 0.6 - tilt.current) * 0.05;
    const tl = tilt.current;
    const project = (lon: number, lat: number) => {
      const x = Math.cos(lat) * Math.sin(lon + rot);
      const y0 = Math.sin(lat);
      const z0 = Math.cos(lat) * Math.cos(lon + rot);
      const y = y0 * Math.cos(tl) - z0 * Math.sin(tl);
      const z = y0 * Math.sin(tl) + z0 * Math.cos(tl);
      return { x: cx + x * R, y: cy - y * R, z };
    };
    const g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R);
    g.addColorStop(0, `rgb(${color} / .18)`);
    g.addColorStop(1, `rgb(${color} / .02)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
    for (const [lon, lat] of pts) {
      const p = project(lon, lat);
      if (p.z < 0) continue;
      ctx.fillStyle = `rgb(${color} / ${0.25 + p.z * 0.7})`;
      ctx.fillRect(p.x, p.y, 1.6, 1.6);
    }
    const rad = (d: number) => (d * Math.PI) / 180;
    arcs.forEach((a, i) => {
      const t = ((time * 0.35 + i * 0.27) % 1.4) / 1;
      const steps = 40;
      ctx.strokeStyle = "rgb(244 114 182 / .9)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      let started = false;
      for (let s = 0; s <= steps; s++) {
        const f = s / steps;
        if (f > Math.min(1, t)) break;
        if (f < Math.max(0, t - 0.4)) continue;
        const lon = rad(a.from[1] + (a.to[1] - a.from[1]) * f);
        const lat = rad(a.from[0] + (a.to[0] - a.from[0]) * f);
        const lift = 1 + Math.sin(f * Math.PI) * 0.18;
        const p = project(lon, lat);
        const x = cx + (p.x - cx) * lift;
        const y = cy + (p.y - cy) * lift;
        if (p.z < -0.1) continue;
        if (!started) ctx.moveTo(x, y), (started = true);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
  });
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <canvas ref={ref} role="img" aria-label="Rotating globe with connections between cities" className="absolute inset-0 -z-10 h-full w-full" />
      {children}
    </div>
  );
}
