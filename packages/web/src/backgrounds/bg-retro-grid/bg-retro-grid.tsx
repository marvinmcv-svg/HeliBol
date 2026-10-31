import type { ReactNode } from "react";
import { cn } from "@kinetik/core/utils";

const css = `
.k-retro{position:absolute;inset:0;overflow:hidden;perspective:220px;opacity:.6}
.k-retro>div{position:absolute;inset:0;transform:rotateX(65deg)}
.k-retro>div>div{position:absolute;inset:0 0 0 0;margin-left:-50%;width:600vw;height:300vh;background-image:linear-gradient(to right,var(--k-grid) 1px,transparent 0),linear-gradient(to bottom,var(--k-grid) 1px,transparent 0);background-size:60px 60px;background-repeat:repeat;transform-origin:100% 0 0;animation:k-retro 15s linear infinite}
@keyframes k-retro{0%{transform:translateY(-50%)}100%{transform:translateY(0)}}
@media (prefers-reduced-motion:reduce){.k-retro>div>div{animation:none}}
[data-reduce-motion] .k-retro>div>div{animation:none}`;

/** Synthwave perspective floor grid scrolling toward the horizon. CSS only. */
export function BgRetroGrid({ children, color = "rgb(236 72 153 / .5)", className }: { children?: ReactNode; color?: string; className?: string }) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <style href="k-retro" precedence="kinetik">{css}</style>
      <div aria-hidden className="k-retro -z-10" style={{ "--k-grid": color } as React.CSSProperties}><div><div /></div></div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-background/90" />
      {children}
    </div>
  );
}
