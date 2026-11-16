"use client";
import { cn } from "@kinetik/core";

const css = `
.k-hnf .frame{position:absolute;border:1.5px solid #6d4aff;border-radius:calc(28px + var(--i)*10px);inset:calc(var(--i)*-26px);opacity:calc(1 - var(--i)*.18);animation:k-hnf-pulse 4s ease-in-out infinite;animation-delay:calc(var(--i)*.25s)}
@keyframes k-hnf-pulse{50%{border-color:#b9a6ff;box-shadow:0 0 24px #6d4aff55}}
.k-hnf .glow{background:radial-gradient(circle at var(--x,40%) 30%,#6b4ec2 0,transparent 55%);animation:k-hnf-glow 9s ease-in-out infinite alternate}
@property --x{syntax:"<percentage>";initial-value:40%;inherits:false}
@keyframes k-hnf-glow{to{--x:62%}}
.k-hnf .in{animation:k-hnf-in 1s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hnf-in{from{opacity:0;transform:scale(.96);filter:blur(8px)}}
.k-hnf .bob{animation:k-hnf-bob 1.8s ease-in-out infinite}
@keyframes k-hnf-bob{50%{transform:translateY(5px)}}
@media (prefers-reduced-motion:reduce){.k-hnf *{animation:none!important}}
[data-reduce-motion] .k-hnf *{animation:none!important}`;

/** Manifesto hero: the copy sits in a glowing panel wrapped by concentric rounded frames that pulse outward in sequence. */
export function HeroNestedFrames({ title = "We believe in builders", subtitle = "People who set out to create and lead change — through new companies, products, services, brands or communities.", className }: { title?: string; subtitle?: string; className?: string }) {
  return (
    <section className={cn("k-hnf relative grid place-items-center overflow-hidden bg-[#1a0f3d] px-14 py-16 text-white", className)}>
      <style href="k-hnf" precedence="kinetik">{css}</style>
      <div className="relative w-full max-w-3xl">
        {[3, 2, 1].map((i) => <span key={i} aria-hidden className="frame" style={{ ["--i" as string]: i }} />)}
        <div className="glow relative rounded-[28px] border-[1.5px] border-[#7c5cff] bg-[#2a1960] px-6 py-16 text-center">
          <h1 className="in text-4xl font-medium tracking-tight sm:text-5xl">{title}</h1>
          <p className="in mx-auto mt-4 max-w-lg text-white/75" style={{ ["--d" as string]: ".15s" }}>{subtitle}</p>
          <a href="#more" aria-label="Scroll down" className="bob mx-auto mt-7 grid size-8 place-items-center rounded-full border border-white/60 text-sm">↓</a>
        </div>
      </div>
    </section>
  );
}
