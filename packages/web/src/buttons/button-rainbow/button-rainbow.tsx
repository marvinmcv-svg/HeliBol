import type { ButtonHTMLAttributes } from "react";
import { cn } from "@kinetik/core/utils";

const css = `
@property --k-rb-a{syntax:"<angle>";initial-value:0deg;inherits:false}
.k-rainbow{position:relative;isolation:isolate;background:linear-gradient(var(--color-foreground,#111),var(--color-foreground,#111)) padding-box,conic-gradient(from var(--k-rb-a),#f43f5e,#f59e0b,#84cc16,#06b6d4,#8b5cf6,#f43f5e) border-box;border:2px solid transparent;animation:k-rb 3s linear infinite}
.k-rainbow::after{content:"";position:absolute;inset:auto 12% -14px;height:60%;z-index:-1;background:conic-gradient(from var(--k-rb-a),#f43f5e,#f59e0b,#84cc16,#06b6d4,#8b5cf6,#f43f5e);filter:blur(16px);opacity:.7;animation:k-rb 3s linear infinite}
@keyframes k-rb{to{--k-rb-a:360deg}}
@media (prefers-reduced-motion:reduce){.k-rainbow,.k-rainbow::after{animation:none}}
[data-reduce-motion] .k-rainbow,[data-reduce-motion] .k-rainbow::after{animation:none}`;

/** Dark pill with a rotating rainbow border and a soft rainbow glow underneath. */
export function ButtonRainbow({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <>
      <style href="k-rainbow" precedence="kinetik">{css}</style>
      <button className={cn("k-rainbow inline-flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-semibold text-background outline-none transition-transform active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background", className)} {...props} />
    </>
  );
}
