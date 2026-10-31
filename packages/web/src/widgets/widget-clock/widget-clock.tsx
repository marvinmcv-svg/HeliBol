"use client";
import { useEffect, useState } from "react";
import { cn, useReducedMotion } from "@kinetik/core";

/** Analog clock with a smooth sweeping second hand (or ticking under reduced motion) and a digital readout. */
export function WidgetClock({ timeZone, label, className }: { timeZone?: string; label?: string; className?: string }) {
  const [now, setNow] = useState<Date | null>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    let raf = 0;
    let int = 0;
    const tick = () => setNow(new Date());
    if (reduced) {
      tick();
      int = window.setInterval(tick, 1000);
    } else {
      const loop = () => {
        tick();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    return () => (cancelAnimationFrame(raf), clearInterval(int));
  }, [reduced]);
  const parts = now ? Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone, hour: "numeric", minute: "numeric", second: "numeric", hour12: false }).formatToParts(now).map((p) => [p.type, p.value])) : { hour: "0", minute: "0", second: "0" };
  const ms = now ? now.getMilliseconds() : 0;
  const s = Number(parts.second) + (reduced ? 0 : ms / 1000);
  const m = Number(parts.minute) + s / 60;
  const h = (Number(parts.hour) % 12) + m / 60;
  const hand = (deg: number, cls: string) => <span className={cn("absolute bottom-1/2 left-1/2 origin-bottom -translate-x-1/2 rounded-full", cls)} style={{ rotate: `${deg}deg` }} />;
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div role="img" aria-label={`${label ?? "Local"} time ${parts.hour}:${parts.minute}`} className="relative size-36 rounded-full border border-border bg-card shadow-[inset_0_2px_10px_rgb(0_0_0/.08),0_10px_30px_-10px_rgb(0_0_0/.3)]">
        {Array.from({ length: 12 }, (_, i) => <span key={i} className="absolute top-2 left-1/2 h-[calc(100%-1rem)] w-px -translate-x-1/2" style={{ rotate: `${i * 30}deg` }}><span className={cn("block w-px bg-muted-foreground", i % 3 ? "h-1.5" : "h-3 w-0.5")} /></span>)}
        {hand(h * 30, "h-[26%] w-1 bg-foreground")}
        {hand(m * 6, "h-[36%] w-0.5 bg-foreground")}
        {hand(s * 6, "h-[40%] w-px bg-orange-500")}
        <span className="absolute top-1/2 left-1/2 size-2 -translate-1/2 rounded-full bg-orange-500" />
      </div>
      <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">{label ?? "Local"}</span> · <span className="tabular-nums">{parts.hour}:{parts.minute}</span></p>
    </div>
  );
}
