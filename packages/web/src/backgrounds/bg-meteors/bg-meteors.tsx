"use client";
import { useMemo, type ReactNode } from "react";
import { cn } from "@kinetik/core";

export interface BgMeteorsProps {
  children?: ReactNode;
  count?: number;
  angle?: number;
  className?: string;
}

const css = `
.k-meteor{position:absolute;top:-5%;width:2px;height:2px;border-radius:9999px;background:#fff;box-shadow:0 0 0 1px rgb(255 255 255/.08);rotate:var(--k-angle);animation:k-meteor linear infinite}
.k-meteor::after{content:"";position:absolute;top:50%;right:1px;width:80px;height:1px;translate:0 -50%;background:linear-gradient(90deg,transparent,rgb(255 255 255/.7))}
@keyframes k-meteor{0%{transform:translateX(0);opacity:0}5%{opacity:1}70%{opacity:1}100%{transform:translateX(900px);opacity:0}}
@media (prefers-reduced-motion:reduce){.k-meteor{display:none}}
[data-reduce-motion] .k-meteor{display:none}`;

export function BgMeteors({ children, count = 18, angle = 145, className }: BgMeteorsProps) {
  // deterministic pseudo-random so SSR and client match
  const meteors = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (n: number) => ((Math.sin(i * 9301 + n * 49297) + 1) / 2) % 1;
        return { left: `${r(1) * 110}%`, delay: `${r(2) * 6}s`, duration: `${3 + r(3) * 5}s` };
      }),
    [count],
  );
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <style href="k-meteor" precedence="kinetik">{css}</style>
      <div aria-hidden className="absolute inset-0 -z-10" style={{ "--k-angle": `${angle}deg` } as React.CSSProperties}>
        {meteors.map((m, i) => (
          <span key={i} className="k-meteor" style={{ left: m.left, animationDelay: m.delay, animationDuration: m.duration }} />
        ))}
      </div>
      {children}
    </div>
  );
}
