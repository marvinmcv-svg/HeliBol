import { cn } from "@kinetik/core/utils";

export type SpinnerVariant = "ring" | "dots" | "bars" | "orbit" | "pulse" | "wave" | "square" | "bounce";

const css = `
.k-sp{color:currentColor;display:inline-block;position:relative}
.k-sp-ring{border-radius:9999px;border:2.5px solid color-mix(in oklab,currentColor 20%,transparent);border-top-color:currentColor;animation:k-spin .8s linear infinite}
@keyframes k-spin{to{rotate:360deg}}
.k-sp-dots{display:inline-flex;gap:15%;align-items:center}.k-sp-dots i{width:22%;aspect-ratio:1;border-radius:9999px;background:currentColor;animation:k-fade 1s ease-in-out infinite}
.k-sp-dots i:nth-child(2){animation-delay:.15s}.k-sp-dots i:nth-child(3){animation-delay:.3s}
@keyframes k-fade{0%,100%{opacity:.2;scale:.8}50%{opacity:1;scale:1}}
.k-sp-bars{display:inline-flex;gap:12%;align-items:center}.k-sp-bars i{width:14%;height:100%;border-radius:2px;background:currentColor;animation:k-bar 1s ease-in-out infinite}
.k-sp-bars i:nth-child(2){animation-delay:.1s}.k-sp-bars i:nth-child(3){animation-delay:.2s}.k-sp-bars i:nth-child(4){animation-delay:.3s}
@keyframes k-bar{0%,100%{scale:1 .35}50%{scale:1 1}}
.k-sp-orbit{animation:k-spin 1.2s cubic-bezier(.5,.1,.5,.9) infinite}.k-sp-orbit i{position:absolute;width:24%;aspect-ratio:1;border-radius:9999px;background:currentColor;top:0;left:38%}.k-sp-orbit i:nth-child(2){top:auto;bottom:0;opacity:.4}
.k-sp-pulse i{position:absolute;inset:0;border-radius:9999px;background:currentColor;animation:k-pulse 1.4s cubic-bezier(0,0,.2,1) infinite}.k-sp-pulse i:nth-child(2){animation-delay:.7s}
@keyframes k-pulse{0%{scale:0;opacity:.8}100%{scale:1;opacity:0}}
.k-sp-wave{display:inline-flex;gap:10%;align-items:center}.k-sp-wave i{width:18%;aspect-ratio:1;border-radius:9999px;background:currentColor;animation:k-wave .9s ease-in-out infinite}
.k-sp-wave i:nth-child(2){animation-delay:.1s}.k-sp-wave i:nth-child(3){animation-delay:.2s}.k-sp-wave i:nth-child(4){animation-delay:.3s}
@keyframes k-wave{0%,100%{translate:0 35%}50%{translate:0 -35%}}
.k-sp-square{border:2.5px solid currentColor;border-radius:20%;animation:k-sq 1.6s cubic-bezier(.7,0,.3,1) infinite}
@keyframes k-sq{0%{rotate:0deg;border-radius:20%}50%{rotate:180deg;border-radius:50%}100%{rotate:360deg;border-radius:20%}}
.k-sp-bounce i{position:absolute;inset:auto 30% 0;aspect-ratio:1;border-radius:9999px;background:currentColor;animation:k-bounce .6s cubic-bezier(.3,0,.7,1) infinite alternate}
@keyframes k-bounce{from{translate:0 0;scale:1.15 .85}to{translate:0 -160%;scale:1}}
@media (prefers-reduced-motion:reduce){.k-sp,.k-sp i{animation-duration:3s!important}}`;

export function Spinner({ variant = "ring", size = 28, className, label = "Loading" }: { variant?: SpinnerVariant; size?: number; className?: string; label?: string }) {
  const children = { ring: 0, dots: 3, bars: 4, orbit: 2, pulse: 2, wave: 4, square: 0, bounce: 1 }[variant];
  return (
    <>
      <style href="k-spinners" precedence="kinetik">{css}</style>
      <span role="status" aria-label={label} className={cn("k-sp", `k-sp-${variant}`, className)} style={{ width: size, height: size }}>
        {Array.from({ length: children }, (_, i) => <i key={i} />)}
      </span>
    </>
  );
}
