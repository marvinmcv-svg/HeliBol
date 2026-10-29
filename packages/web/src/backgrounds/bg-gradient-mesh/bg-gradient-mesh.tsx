import type { ReactNode } from "react";
import { cn } from "@kinetik/core/utils";

export interface BgGradientMeshProps {
  children?: ReactNode;
  colors?: [string, string, string, string];
  speed?: number;
  className?: string;
}

const css = `
@property --k-m1x{syntax:"<percentage>";initial-value:20%;inherits:false}
@property --k-m1y{syntax:"<percentage>";initial-value:20%;inherits:false}
@property --k-m2x{syntax:"<percentage>";initial-value:80%;inherits:false}
@property --k-m2y{syntax:"<percentage>";initial-value:30%;inherits:false}
@property --k-m3x{syntax:"<percentage>";initial-value:60%;inherits:false}
@property --k-m3y{syntax:"<percentage>";initial-value:85%;inherits:false}
.k-mesh{background:
 radial-gradient(at var(--k-m1x) var(--k-m1y),var(--k-c1) 0,transparent 55%),
 radial-gradient(at var(--k-m2x) var(--k-m2y),var(--k-c2) 0,transparent 55%),
 radial-gradient(at var(--k-m3x) var(--k-m3y),var(--k-c3) 0,transparent 55%),var(--k-c4);
 animation:k-mesh var(--k-mesh-speed) ease-in-out infinite alternate}
@keyframes k-mesh{
 33%{--k-m1x:70%;--k-m1y:30%;--k-m2x:30%;--k-m2y:70%;--k-m3x:80%;--k-m3y:60%}
 66%{--k-m1x:40%;--k-m1y:80%;--k-m2x:75%;--k-m2y:15%;--k-m3x:15%;--k-m3y:40%}
 100%{--k-m1x:15%;--k-m1y:55%;--k-m2x:85%;--k-m2y:75%;--k-m3x:50%;--k-m3y:10%}}
@media (prefers-reduced-motion:reduce){.k-mesh{animation:none}}
[data-reduce-motion] .k-mesh{animation:none}`;

export function BgGradientMesh({ children, colors = ["#f472b6", "#818cf8", "#fbbf24", "#1e1b4b"], speed = 12, className }: BgGradientMeshProps) {
  return (
    <div
      className={cn("k-mesh relative isolate", className)}
      style={{ "--k-c1": colors[0], "--k-c2": colors[1], "--k-c3": colors[2], "--k-c4": colors[3], "--k-mesh-speed": `${speed}s` } as React.CSSProperties}
    >
      <style href="k-mesh" precedence="kinetik">{css}</style>
      {children}
    </div>
  );
}
