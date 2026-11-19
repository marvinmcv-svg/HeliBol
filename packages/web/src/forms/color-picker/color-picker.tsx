"use client";
import { useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
  swatches?: string[];
  label?: string;
  className?: string;
}

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
function hexToHsv(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", "").padEnd(6, "0").slice(0, 6), 16);
  const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), d = max - Math.min(r, g, b);
  let h = 0;
  if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [((h * 60) + 360) % 360, max ? d / max : 0, max];
}
function hsvToHex(h: number, s: number, v: number) {
  const f = (k: number) => {
    const n = (k + h / 60) % 6;
    return Math.round((v - v * s * Math.max(0, Math.min(n, 4 - n, 1))) * 255);
  };
  return `#${[f(5), f(3), f(1)].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

const DEFAULT_SWATCHES = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#18181b"];

/**
 * Colour picker: saturation/value plane, hue slider and swatches. Thumbs follow the pointer with a
 * spring and scale up while dragging; both controls are keyboard sliders; hex input validates live.
 */
export function ColorPicker({ value, onChange, swatches = DEFAULT_SWATCHES, label = "Colour", className }: ColorPickerProps) {
  const reduced = useReducedMotion();
  const id = useId();
  const [h, s, v] = hexToHsv(value);
  const [hue, setHue] = useState(h);
  const [dragging, setDragging] = useState<"sv" | "hue" | null>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const plane = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const t = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 700, damping: 40 };
  // keep the user's hue when saturation hits 0 (grey has no hue)
  const H = s === 0 ? hue : h;

  const fromPlane = (x: number, y: number) => {
    const r = plane.current!.getBoundingClientRect();
    onChange(hsvToHex(H, clamp((x - r.left) / r.width), 1 - clamp((y - r.top) / r.height)));
  };
  const fromBar = (x: number) => {
    const r = bar.current!.getBoundingClientRect();
    const nh = clamp((x - r.left) / r.width) * 359.9;
    setHue(nh);
    onChange(hsvToHex(nh, s, v));
  };
  const drag = (kind: "sv" | "hue") => ({
    onPointerDown: (e: React.PointerEvent) => {
      setDragging(kind);
      e.currentTarget.setPointerCapture(e.pointerId);
      kind === "sv" ? fromPlane(e.clientX, e.clientY) : fromBar(e.clientX);
    },
    onPointerMove: (e: React.PointerEvent) => dragging === kind && (kind === "sv" ? fromPlane(e.clientX, e.clientY) : fromBar(e.clientX)),
    onPointerUp: () => setDragging(null),
  });

  return (
    <div className={cn("w-64 space-y-3 rounded-2xl border border-border bg-card p-3 shadow-sm", className)}>
      <div
        ref={plane}
        role="slider"
        tabIndex={0}
        aria-label={`${label} saturation and brightness`}
        aria-valuetext={`saturation ${Math.round(s * 100)}%, brightness ${Math.round(v * 100)}%`}
        onKeyDown={(e) => {
          const d = e.shiftKey ? 0.1 : 0.02;
          const m: Record<string, [number, number]> = { ArrowRight: [d, 0], ArrowLeft: [-d, 0], ArrowUp: [0, d], ArrowDown: [0, -d] };
          if (m[e.key]) (e.preventDefault(), onChange(hsvToHex(H, clamp(s + m[e.key][0]), clamp(v + m[e.key][1]))));
        }}
        {...drag("sv")}
        className="relative h-36 cursor-crosshair touch-none rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
        style={{ background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${H} 100% 50%))` }}
      >
        <motion.span
          aria-hidden
          className="absolute -ml-2.5 -mt-2.5 size-5 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/.3),0_2px_8px_rgb(0_0_0/.3)]"
          style={{ background: value }}
          animate={{ left: `${s * 100}%`, top: `${(1 - v) * 100}%`, scale: dragging === "sv" && !reduced ? 1.3 : 1 }}
          transition={t}
        />
      </div>
      <div
        ref={bar}
        role="slider"
        tabIndex={0}
        aria-label={`${label} hue`}
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={Math.round(H)}
        onKeyDown={(e) => {
          const d = e.key === "ArrowRight" || e.key === "ArrowUp" ? 5 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -5 : 0;
          if (d) (e.preventDefault(), setHue((H + d + 360) % 360), onChange(hsvToHex((H + d + 360) % 360, s, v)));
        }}
        {...drag("hue")}
        className="relative h-3 cursor-pointer touch-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
        style={{ background: "linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)" }}
      >
        <motion.span aria-hidden className="absolute top-1/2 -ml-2 -mt-2 size-4 rounded-full border-2 border-white shadow" style={{ background: `hsl(${H} 100% 50%)` }} animate={{ left: `${(H / 360) * 100}%`, scale: dragging === "hue" && !reduced ? 1.3 : 1 }} transition={t} />
      </div>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Swatches">
        {swatches.map((c) => (
          <motion.button key={c} type="button" onClick={() => (onChange(c), setHue(hexToHsv(c)[0]))} aria-label={c} aria-pressed={c.toLowerCase() === value.toLowerCase()} whileHover={reduced ? undefined : { scale: 1.15 }} whileTap={reduced ? undefined : { scale: 0.9 }} className="size-6 rounded-full ring-offset-2 ring-offset-card aria-pressed:ring-2 aria-pressed:ring-foreground" style={{ background: c }} />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <motion.span layout animate={{ background: value }} transition={reduced ? { duration: 0 } : spring.smooth} className="size-8 shrink-0 rounded-lg border border-border" />
        <label htmlFor={id} className="sr-only">{label} hex</label>
        <input
          id={id}
          value={draft ?? value}
          onChange={(e) => {
            const x = e.target.value.trim();
            setDraft(x);
            if (/^#?[0-9a-f]{6}$/i.test(x)) onChange(x.startsWith("#") ? x : `#${x}`);
          }}
          onBlur={() => setDraft(null)}
          aria-invalid={draft !== null && !/^#?[0-9a-f]{6}$/i.test(draft)}
          className="h-8 w-full rounded-lg border border-border bg-background px-2 font-mono text-sm uppercase outline-none focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-rose-500"
        />
      </div>
    </div>
  );
}
