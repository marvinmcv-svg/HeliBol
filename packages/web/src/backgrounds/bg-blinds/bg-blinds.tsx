import type { ReactNode } from "react";
import { cn } from "@kinetik/core/utils";

const css = `
.k-blinds{position:absolute;inset:-20%;background:repeating-linear-gradient(100deg,transparent 0 6%,rgb(255 255 255/.07) 7% 9%,transparent 10% 14%),linear-gradient(120deg,var(--k-b1),var(--k-b2),var(--k-b3),var(--k-b1));background-size:100% 100%,300% 300%;animation:k-blinds 14s ease-in-out infinite alternate;filter:saturate(1.2)}
@keyframes k-blinds{0%{background-position:0 0,0% 50%}100%{background-position:0 0,100% 50%;transform:translateX(4%)}}
@media (prefers-reduced-motion:reduce){.k-blinds{animation:none}}
[data-reduce-motion] .k-blinds{animation:none}`;

/** Slatted light: a moving gradient seen through diagonal glass blinds. CSS only. */
export function BgBlinds({ children, colors = ["#4f46e5", "#db2777", "#f59e0b"], className }: { children?: ReactNode; colors?: [string, string, string]; className?: string }) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <style href="k-blinds" precedence="kinetik">{css}</style>
      <div aria-hidden className="k-blinds -z-10" style={{ "--k-b1": colors[0], "--k-b2": colors[1], "--k-b3": colors[2] } as React.CSSProperties} />
      {children}
    </div>
  );
}
