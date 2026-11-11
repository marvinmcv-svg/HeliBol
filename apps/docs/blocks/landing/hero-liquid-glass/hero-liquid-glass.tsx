"use client";
import { useId, type ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";
import { useReducedMotion } from "@kinetik/core";

/**
 * "Liquid glass" agency hero: a slow Ken Burns photo behind frosted, refracting glass UI. The glass
 * is backdrop-filter blur + an SVG feDisplacementMap that bends what's behind the edges, plus a
 * specular rim. Headline words rise in with blur.
 */
function Glass({ children, className = "", filterId }: { children: ReactNode; className?: string; filterId: string }) {
  return (
    <div className={`relative isolate overflow-hidden ${className}`}>
      {/* refraction layer: the backdrop seen through a displacement filter */}
      <span aria-hidden className="absolute inset-0 -z-10 rounded-[inherit] backdrop-blur-md" style={{ backdropFilter: `blur(10px) url(#${filterId})`, WebkitBackdropFilter: "blur(10px)" }} />
      <span aria-hidden className="absolute inset-0 -z-10 rounded-[inherit] bg-white/10 shadow-[inset_0_1px_0_rgb(255_255_255/.55),inset_0_-1px_0_rgb(255_255_255/.12),inset_0_0_24px_rgb(255_255_255/.12),0_10px_40px_-10px_rgb(0_0_0/.45)]" />
      {children}
    </div>
  );
}

export function HeroLiquidGlass() {
  const reduced = useReducedMotion();
  const fid = `lg-${useId().replace(/:/g, "")}`;
  const words = "We design brands that feel alive.".split(" ");
  return (
    <section className="relative h-full min-h-[560px] overflow-hidden rounded-[2rem] text-white">
      <svg aria-hidden className="absolute size-0">
        <filter id={fid} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="38" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <motion.img
        src="/demo/photo-6.jpg"
        alt=""
        className="absolute inset-0 size-full object-cover"
        initial={{ scale: 1.15 }}
        animate={reduced ? { scale: 1.05 } : { scale: [1.15, 1.02, 1.15], x: ["0%", "-2%", "0%"] }}
        transition={reduced ? { duration: 0 } : { duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

      <div className="relative flex h-full flex-col p-5 sm:p-8">
        <Glass filterId={fid} className="mx-auto flex w-full max-w-3xl items-center justify-between rounded-full py-2 pl-5 pr-2">
          <span className="text-sm font-semibold tracking-tight">Orvo®</span>
          <nav aria-label="Main" className="hidden gap-6 text-sm text-white/80 sm:flex">
            {["Work", "Studio", "Services", "Journal"].map((l) => <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-white">{l}</a>)}
          </nav>
          <a href="#contact" className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black">Let&apos;s talk</a>
        </Glass>

        <div className="mt-auto max-w-3xl pb-4">
          <h1 className="text-[clamp(2.4rem,7vw,5rem)] font-semibold leading-[0.95] tracking-tight">
            {words.map((w, i) => (
              <motion.span
                key={i}
                className="mr-[0.25em] inline-block"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: reduced ? 0.2 : 0.9, delay: reduced ? 0 : 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                {w}
              </motion.span>
            ))}
          </h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduced ? 0 : 0.9 }} className="mt-6 flex flex-wrap items-center gap-3">
            <Glass filterId={fid} className="rounded-full">
              <a href="#work" className="flex items-center gap-2 px-5 py-3 text-sm font-medium">View our work <ArrowUpRight className="size-4" /></a>
            </Glass>
            <Glass filterId={fid} className="rounded-full">
              <button type="button" className="flex items-center gap-2 px-5 py-3 text-sm"><Play className="size-4 fill-current" /> Showreel 2026</button>
            </Glass>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
