import type { ReactNode } from "react";
import { cn } from "@kinetik/core/utils";

const css = `
@property --k-neon-a{syntax:"<angle>";initial-value:0deg;inherits:false}
.k-neon{position:relative;border-radius:1.5rem;padding:2px;background:conic-gradient(from var(--k-neon-a),var(--k-n1),var(--k-n2),var(--k-n1));animation:k-neon 5s linear infinite}
.k-neon::before{content:"";position:absolute;inset:0;border-radius:inherit;background:inherit;filter:blur(24px);opacity:.65;z-index:-1}
@keyframes k-neon{to{--k-neon-a:360deg}}
@media (prefers-reduced-motion:reduce){.k-neon{animation:none}}
[data-reduce-motion] .k-neon{animation:none}`;

/** Card with a living two-tone neon gradient border and a matching bloom behind it. */
export function CardNeon({ children, from = "#ff2975", to = "#00d4ff", className }: { children: ReactNode; from?: string; to?: string; className?: string }) {
  return (
    <>
      <style href="k-neon" precedence="kinetik">{css}</style>
      <div className="relative isolate">
        <div className="k-neon" style={{ "--k-n1": from, "--k-n2": to } as React.CSSProperties}>
          <div className={cn("relative rounded-[calc(1.5rem-2px)] bg-card", className)}>{children}</div>
        </div>
      </div>
    </>
  );
}
