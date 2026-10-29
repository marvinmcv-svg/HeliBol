import type { ElementType, ReactNode } from "react";
import { cn } from "@kinetik/core/utils";

export interface TextGradientAnimatedProps {
  children: ReactNode;
  as?: ElementType;
  /** CSS colors for the gradient stops. */
  colors?: string[];
  /** Seconds per loop. */
  speed?: number;
  className?: string;
}

const css = `
.k-text-gradient{background-image:linear-gradient(90deg,var(--k-tg-colors));background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:k-text-gradient var(--k-tg-speed) linear infinite}
@keyframes k-text-gradient{to{background-position:300% 0}}
@media (prefers-reduced-motion:reduce){.k-text-gradient{animation:none}}
[data-reduce-motion] .k-text-gradient{animation:none}`;

export function TextGradientAnimated({
  children,
  as: Tag = "span",
  colors = ["#8b5cf6", "#ec4899", "#f59e0b", "#06b6d4", "#8b5cf6"],
  speed = 6,
  className,
}: TextGradientAnimatedProps) {
  return (
    <>
      <style href="k-text-gradient" precedence="kinetik">{css}</style>
      <Tag
        className={cn("k-text-gradient", className)}
        style={{ "--k-tg-colors": colors.join(","), "--k-tg-speed": `${speed}s` } as React.CSSProperties}
      >
        {children}
      </Tag>
    </>
  );
}
