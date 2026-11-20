import type { ReactNode } from "react";
import { cn } from "@kinetik/core/utils";

export interface HeroAuroraTypeProps {
  /** Giant word the aurora flows through. */
  word: string;
  children?: ReactNode;
  colors?: [string, string, string];
  className?: string;
}

const css = `
@keyframes kn-at-a { 0% { transform: translate(-25%, -10%) rotate(0deg) scale(1); } 50% { transform: translate(20%, 12%) rotate(180deg) scale(1.35); } 100% { transform: translate(-25%, -10%) rotate(360deg) scale(1); } }
@keyframes kn-at-b { 0%, 100% { transform: translate(25%, 8%) scale(1.2); } 50% { transform: translate(-20%, -6%) scale(.85); } }
.kn-at-a { animation: kn-at-a 14s linear infinite; }
.kn-at-b { animation: kn-at-b 9s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .kn-at-a, .kn-at-b { animation: none; } }
[data-reduce-motion] .kn-at-a, [data-reduce-motion] .kn-at-b { animation: none; }
`;

function Blobs({ colors }: { colors: [string, string, string] }) {
  return (
    <>
      <span className="kn-at-a absolute left-[0%] top-[-30%] h-[160%] w-[55%] rounded-full blur-2xl" style={{ background: colors[0] }} />
      <span className="kn-at-b absolute left-[30%] top-[-20%] h-[150%] w-[45%] rounded-full blur-2xl" style={{ background: colors[1] }} />
      <span className="kn-at-a absolute left-[55%] top-[-10%] h-[140%] w-[50%] rounded-full blur-2xl [animation-direction:reverse]" style={{ background: colors[2] }} />
    </>
  );
}

/**
 * A massive word filled with a living aurora: drifting, blurred colour blobs sit behind a white-on-
 * black copy of the word blended with `multiply`, so the light only shows through the letterforms.
 * A blurred echo of the same light glows on the floor beneath. Pure CSS, zero JS.
 */
export function HeroAuroraType({ word, children, colors = ["#22d3ee", "#a855f7", "#f472b6"], className }: HeroAuroraTypeProps) {
  return (
    <section className={cn("relative isolate flex h-full min-h-[420px] flex-col items-center justify-center overflow-hidden bg-black px-6 text-white", className)}>
      <style href="kn-hero-aurora-type" precedence="kinetik">{css}</style>
      <h1 className="relative isolate overflow-hidden">
        <span aria-hidden className="absolute inset-0 -z-10"><Blobs colors={colors} /></span>
        {/* white letters on black, multiplied over the blobs = aurora inside the type only */}
        <span className="block bg-black px-[0.06em] text-[clamp(4rem,19vw,14rem)] font-black uppercase leading-[0.9] tracking-tighter text-white mix-blend-multiply">{word}</span>
      </h1>
      <div aria-hidden className="pointer-events-none relative -mt-4 h-20 w-[70%] opacity-50 blur-3xl"><Blobs colors={colors} /></div>
      {children && <div className="relative -mt-8 text-center">{children}</div>}
    </section>
  );
}
