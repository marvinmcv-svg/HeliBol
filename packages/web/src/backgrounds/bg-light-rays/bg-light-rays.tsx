import type { ReactNode } from "react";
import { cn } from "@kinetik/core/utils";

const css = `
@property --k-ray-a{syntax:"<angle>";initial-value:0deg;inherits:false}
.k-rays{position:absolute;left:50%;top:-40%;width:160%;aspect-ratio:1;translate:-50% 0;background:repeating-conic-gradient(from var(--k-ray-a) at 50% 50%,var(--k-ray) 0deg 4deg,transparent 4deg 16deg);mask-image:radial-gradient(circle at 50% 50%,#000 0%,transparent 55%);animation:k-rays 40s linear infinite;opacity:.55}
@keyframes k-rays{to{--k-ray-a:360deg}}
@media (prefers-reduced-motion:reduce){.k-rays{animation:none}}
[data-reduce-motion] .k-rays{animation:none}`;

/** Slowly rotating god-rays fanning from above — celebratory, 'achievement unlocked' energy. CSS only. */
export function BgLightRays({ children, color = "rgb(250 204 21 / .35)", className }: { children?: ReactNode; color?: string; className?: string }) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <style href="k-rays" precedence="kinetik">{css}</style>
      <div aria-hidden className="k-rays -z-10" style={{ "--k-ray": color } as React.CSSProperties} />
      {children}
    </div>
  );
}
