"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { ThreeParticleMorph, type MorphShape } from "@web/3d/three-particle-morph/three-particle-morph";
import { TextSmartAnimate } from "@web/text/text-smart-animate/text-smart-animate";
import { InputTypingPlaceholder } from "@web/forms/input-typing-placeholder/input-typing-placeholder";
import { useReducedMotion } from "@kinetik/core";

const shapes: MorphShape[] = ["sphere", "helix", "torus", "wave"];
const captions = ["Reasoning", "Memory", "Planning", "Acting"];

/** AI product hero: a particle "brain" morphing between shapes behind the headline, a typing prompt box and a capability ticker that follows the morph. */
export function HeroAiParticles() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  return (
    <section className="relative h-full min-h-[560px] overflow-hidden rounded-[2rem] bg-[radial-gradient(ellipse_at_70%_40%,#1e1b4b,#030014_65%)] text-white">
      <div className="absolute inset-0 md:left-[35%]">
        <ThreeParticleMorph shapes={shapes} hold={3} colors={["#c4b5fd", "#22d3ee"]} onShapeChange={setI} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#030014] via-[#030014]/70 to-transparent md:via-transparent" />
      <div className="relative flex h-full max-w-xl flex-col justify-center gap-6 p-8 sm:p-12">
        <motion.span initial={{ opacity: 0, y: reduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} className="w-fit rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-violet-200 backdrop-blur">
          ● Nomi 3 — now with long-term memory
        </motion.span>
        <h1 className="text-[clamp(2.4rem,5.5vw,4.2rem)] font-semibold leading-[1.02] tracking-tight">
          An agent that is<br />
          <TextSmartAnimate words={captions} interval={3000} className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent" />
        </h1>
        <p className="max-w-md text-white/60">Give it a goal. It plans, remembers context across weeks, and acts in the tools you already use.</p>
        <form onSubmit={(e) => e.preventDefault()} className="flex max-w-md items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur [&_input]:border-0 [&_input]:bg-transparent [&_input]:text-white [&_input]:shadow-none">
          <InputTypingPlaceholder aria-label="Ask Nomi" suggestions={["plan my launch week", "summarise yesterday's calls", "draft replies to my inbox"]} prefix="Ask Nomi to" className="flex-1" />
          <button type="submit" aria-label="Send" className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-black"><ArrowRight className="size-4" /></button>
        </form>
        <p className="text-xs text-white/40" aria-live="polite">Now visualising: {captions[i]}</p>
      </div>
    </section>
  );
}
