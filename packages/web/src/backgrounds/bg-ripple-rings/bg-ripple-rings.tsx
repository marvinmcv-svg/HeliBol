import type { ReactNode } from "react";
import { cn } from "@kinetik/core/utils";

const css = `
.k-rings span{position:absolute;left:50%;top:50%;border-radius:9999px;border:1px solid color-mix(in oklab,var(--color-foreground,#888) 18%,transparent);background:color-mix(in oklab,var(--color-foreground,#888) 3%,transparent);translate:-50% -50%;animation:k-rings 3.6s ease-in-out infinite;animation-delay:var(--d)}
@keyframes k-rings{0%,100%{scale:1}50%{scale:.92}}
@media (prefers-reduced-motion:reduce){.k-rings span{animation:none}}
[data-reduce-motion] .k-rings span{animation:none}`;

/** Concentric rings that breathe outward from the center — behind avatars, logos or a CTA. CSS only. */
export function BgRippleRings({ children, count = 8, base = 140, step = 70, className }: { children?: ReactNode; count?: number; base?: number; step?: number; className?: string }) {
  return (
    <div className={cn("relative isolate grid place-items-center overflow-hidden", className)}>
      <style href="k-rings" precedence="kinetik">{css}</style>
      <div aria-hidden className="k-rings absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,#fff,transparent)]">
        {Array.from({ length: count }, (_, i) => (
          <span key={i} style={{ width: base + i * step, height: base + i * step, opacity: 1 - i * (0.8 / count), "--d": `${i * 0.08}s` } as React.CSSProperties} />
        ))}
      </div>
      {children}
    </div>
  );
}
