import type { ReactNode } from "react";
import { cn } from "@kinetik/core/utils";

export interface BgAuroraProps {
  children?: ReactNode;
  colors?: [string, string, string];
  /** Seconds per drift cycle. */
  speed?: number;
  className?: string;
}

const css = `
.k-aurora-blob{position:absolute;border-radius:9999px;filter:blur(64px);opacity:.55;mix-blend-mode:var(--k-aurora-blend,normal);animation:k-aurora var(--k-aurora-speed) ease-in-out infinite alternate}
.k-aurora-blob:nth-child(2){animation-duration:calc(var(--k-aurora-speed) * 1.3);animation-direction:alternate-reverse}
.k-aurora-blob:nth-child(3){animation-duration:calc(var(--k-aurora-speed) * 0.8)}
@keyframes k-aurora{0%{transform:translate(0,0) scale(1) rotate(0)}50%{transform:translate(12%,-8%) scale(1.15) rotate(20deg)}100%{transform:translate(-10%,10%) scale(.9) rotate(-10deg)}}
@media (prefers-reduced-motion:reduce){.k-aurora-blob{animation:none}}
[data-reduce-motion] .k-aurora-blob{animation:none}`;

export function BgAurora({ children, colors = ["#7c3aed", "#06b6d4", "#ec4899"], speed = 14, className }: BgAuroraProps) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <style href="k-aurora" precedence="kinetik">{css}</style>
      <div aria-hidden className="absolute inset-0 -z-10" style={{ "--k-aurora-speed": `${speed}s` } as React.CSSProperties}>
        <div className="k-aurora-blob" style={{ background: colors[0], width: "55%", height: "60%", top: "-15%", left: "-10%" }} />
        <div className="k-aurora-blob" style={{ background: colors[1], width: "50%", height: "55%", top: "10%", right: "-12%" }} />
        <div className="k-aurora-blob" style={{ background: colors[2], width: "45%", height: "50%", bottom: "-20%", left: "25%" }} />
      </div>
      {children}
    </div>
  );
}
