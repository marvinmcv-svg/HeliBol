"use client";
import { useEffect, useState } from "react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface WidgetFlipCountdownProps {
  /** Target date/time. */
  to: Date;
  title?: string;
  className?: string;
}

const css = `
.kn-flip { perspective: 400px; }
@keyframes kn-flip-top { from { transform: rotateX(0deg); } to { transform: rotateX(-90deg); } }
@keyframes kn-flip-bottom { from { transform: rotateX(90deg); } to { transform: rotateX(0deg); } }
.kn-flip-top { transform-origin: bottom; animation: kn-flip-top .3s ease-in forwards; }
.kn-flip-bottom { transform-origin: top; animation: kn-flip-bottom .3s ease-out .3s both; }
@media (prefers-reduced-motion: reduce) { .kn-flip-top, .kn-flip-bottom { animation: none; display: none; } }
[data-reduce-motion] .kn-flip-top, [data-reduce-motion] .kn-flip-bottom { animation: none; display: none; }
`;

function Half({ value, part, className }: { value: string; part: "top" | "bottom"; className?: string }) {
  return (
    <span className={cn("absolute inset-x-0 overflow-hidden bg-zinc-800", part === "top" ? "top-0 h-1/2 rounded-t-lg" : "bottom-0 h-1/2 rounded-b-lg", className)}>
      <span className={cn("absolute inset-x-0 flex h-[200%] items-center justify-center", part === "top" ? "top-0" : "bottom-0")}>{value}</span>
    </span>
  );
}

/** One split-flap card: static halves show the new/old values, two animated leaves flip between them. */
function FlipCard({ value }: { value: string }) {
  const [prev, setPrev] = useState(value);
  const [cur, setCur] = useState(value);
  const [k, setK] = useState(0);
  useEffect(() => {
    if (value === cur) return;
    setPrev(cur);
    setCur(value);
    setK((x) => x + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <span className="kn-flip relative block h-14 w-10 font-mono text-4xl font-bold tabular-nums text-white sm:h-24 sm:w-16 sm:text-6xl">
      <Half value={cur} part="top" />
      <Half value={prev} part="bottom" />
      {k > 0 && (
        <span key={k}>
          <Half value={prev} part="top" className="kn-flip-top z-10" />
          <Half value={cur} part="bottom" className="kn-flip-bottom z-10" />
        </span>
      )}
      <span aria-hidden className="absolute inset-x-0 top-1/2 z-20 h-px bg-black/70" />
    </span>
  );
}

/**
 * Split-flap countdown: each digit is a physical flap — the top leaf falls away and the bottom leaf
 * swings down with the new number, with a hinge line and depth shading. Days, hours, minutes,
 * seconds; an sr-only line gives the time left in words once a minute.
 */
export function WidgetFlipCountdown({ to, title = "Launch in", className }: WidgetFlipCountdownProps) {
  const reduced = useReducedMotion();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, to.getTime() - now);
  const parts = [
    ["Days", Math.floor(diff / 864e5)],
    ["Hours", Math.floor(diff / 36e5) % 24],
    ["Minutes", Math.floor(diff / 6e4) % 60],
    ["Seconds", Math.floor(diff / 1e3) % 60],
  ] as const;
  return (
    <div className={cn("rounded-3xl bg-zinc-950 p-6 text-white shadow-2xl", className)} role="timer" aria-label={title}>
      <style href="kn-widget-flip-countdown" precedence="kinetik">{css}</style>
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">{title}</p>
      <div className="mt-4 flex items-start gap-2 sm:gap-4">
        {parts.map(([label, n], i) => {
          const s = String(n).padStart(2, "0");
          return (
            <div key={label} className="flex items-start gap-2 sm:gap-4">
              <div className="text-center">
                <div className="flex gap-1" aria-hidden>
                  <FlipCard value={s[0]} />
                  <FlipCard value={s[1]} />
                </div>
                <p className="mt-2 text-[10px] uppercase tracking-widest text-white/45">{label}</p>
              </div>
              {i < 3 && <span aria-hidden className="mt-6 text-3xl font-bold text-white/30 sm:mt-8">:</span>}
            </div>
          );
        })}
      </div>
      <p className="sr-only" aria-live={reduced ? "off" : "polite"}>
        {parts[0][1]} days, {parts[1][1]} hours, {parts[2][1]} minutes left
      </p>
    </div>
  );
}
