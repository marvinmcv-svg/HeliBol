import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-particle-text",
  name: "Particle Text Morph",
  description: "Thousands of particles assemble into a word, hold, scatter and re-form into the next — sampled from canvas text, tweened by GSAP, pushed around by your cursor.",
  category: "text",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["particles","canvas","text","hero","generative"],
  pageTypes: ["landing"],
  inspiration: ["GSAP Demo Hub — Canvas particles"],
  a11y: "Canvas is aria-hidden; the current word is announced via a polite sr-only live region. Reduced motion draws the first word statically.",
  perf: "One canvas redrawn on gsap.ticker; particle objects tweened directly (no DOM).",
  status: "stable",
  priority: "P1",
  previewHeight: 400,
  props: [
    { name: "words", type: "string[]", description: "Words to cycle." },
    { name: "hold", type: "number", default: "2.4", description: "Seconds per word." },
    { name: "density", type: "number", default: "5", description: "Sampling step (px)." },
    { name: "colors", type: "string[]", default: "5 colours", description: "Palette." },
  ],
};
