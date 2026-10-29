import { cn } from "@kinetik/core/utils";

export interface ProgressBarAnimatedProps {
  /** 0–100. Omit for indeterminate. */
  value?: number;
  label?: string;
  striped?: boolean;
  className?: string;
}

const css = `
.k-pb-fill{transition:scale .6s cubic-bezier(.16,1,.3,1);transform-origin:left}
.k-pb-indet{position:absolute;inset:0;width:40%;border-radius:inherit;background:currentColor;animation:k-pb-indet 1.4s cubic-bezier(.65,0,.35,1) infinite}
@keyframes k-pb-indet{from{translate:-100% 0}to{translate:250% 0}}
.k-pb-stripes{background-image:linear-gradient(45deg,rgb(255 255 255/.25) 25%,transparent 25% 50%,rgb(255 255 255/.25) 50% 75%,transparent 75%);background-size:16px 16px;animation:k-pb-stripes .8s linear infinite}
@keyframes k-pb-stripes{to{background-position:16px 0}}
@media (prefers-reduced-motion:reduce){.k-pb-stripes{animation:none}.k-pb-indet{animation-duration:3s}}`;

export function ProgressBarAnimated({ value, label = "Progress", striped = false, className }: ProgressBarAnimatedProps) {
  const indeterminate = value === undefined;
  return (
    <>
      <style href="k-pb" precedence="kinetik">{css}</style>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : Math.round(value)}
        className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted text-foreground", className)}
      >
        {indeterminate ? (
          <div className="k-pb-indet" />
        ) : (
          <div className={cn("k-pb-fill h-full rounded-full bg-current", striped && "k-pb-stripes")} style={{ scale: `${Math.max(0, Math.min(100, value)) / 100} 1` }} />
        )}
      </div>
    </>
  );
}
