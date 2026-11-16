"use client";
import { cn } from "@kinetik/core";

const css = `
@property --ha{syntax:"<angle>";initial-value:0deg;inherits:false}
.k-hhe .ring{background:conic-gradient(from var(--ha),#ff8bd1,#ffd38b,#8bffd9,#8bb8ff,#c58bff,#ff8bd1);-webkit-mask:radial-gradient(circle,transparent 58%,#000 60%,#000 66%,transparent 69%);mask:radial-gradient(circle,transparent 58%,#000 60%,#000 66%,transparent 69%);animation:k-hhe-spin 8s linear infinite}
@keyframes k-hhe-spin{to{--ha:360deg}}
.k-hhe .core{animation:k-hhe-breathe 4s ease-in-out infinite}
@keyframes k-hhe-breathe{50%{transform:scale(1.08);opacity:.75}}
.k-hhe .in{animation:k-hhe-in 1.2s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hhe-in{from{opacity:0;transform:translateY(12px)}}
.k-hhe .grow{animation:k-hhe-grow 1.6s cubic-bezier(.16,1,.3,1) both}
@keyframes k-hhe-grow{from{opacity:0;transform:scale(.6);filter:blur(20px)}}
@media (prefers-reduced-motion:reduce){.k-hhe *{animation:none!important}}
[data-reduce-motion] .k-hhe *{animation:none!important}`;

/** Keynote/event hero: a luminous iridescent halo grows out of a blue field and keeps rotating, with a one-line announcement and single pill CTA. */
export function HeroHaloEvent({ announce = "Introducing four new devices, a whole new display and the next generation of audio.", cta = "Watch the event", className }: { announce?: string; cta?: string; className?: string }) {
  return (
    <section className={cn("k-hhe relative grid place-items-center overflow-hidden bg-gradient-to-b from-[#5b8fd8] to-[#3e6fb8] px-6 py-12 text-center text-white", className)}>
      <style href="k-hhe" precedence="kinetik">{css}</style>
      <div aria-hidden className="grow relative size-52">
        <div className="core absolute inset-[18%] rounded-full bg-[radial-gradient(circle,#ffffff_0,#dff1ff_30%,#9cc8ff55_60%,transparent_72%)] blur-md" />
        <div className="ring absolute inset-0 rounded-full blur-[2px]" />
        <div className="ring absolute inset-0 rounded-full opacity-60 blur-xl" />
      </div>
      <h1 className="in mt-4 max-w-lg text-xl leading-snug font-semibold" style={{ ["--d" as string]: ".5s" }}>{announce}</h1>
      <a href="#" className="in mt-5 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 transition-transform hover:scale-105" style={{ ["--d" as string]: ".7s" }}>{cta}</a>
    </section>
  );
}
