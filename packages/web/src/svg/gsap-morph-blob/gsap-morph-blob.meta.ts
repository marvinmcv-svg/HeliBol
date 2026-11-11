import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-morph-blob",
  name: "MorphSVG Shape Cycle",
  description: "One SVG path morphs between a blob, star, heart, bolt and drop with an elastic overshoot — MorphSVG matches different point counts automatically.",
  category: "svg",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["svg","morph","icons","shapes","logo"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["GSAP Demo Hub — Morph between SVG shapes / Smooth morph"],
  a11y: "SVG has role=img with the current shape as its label; buttons use aria-pressed. Reduced motion: instant shape change, no autoplay.",
  perf: "Single path; morphSVG precomputes the interpolation.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "shapes", type: "{ label, d, color }[]", default: "5 shapes", description: "Shapes in a 0..200 viewBox." },
    { name: "interval", type: "number", default: "2.2", description: "Autoplay seconds (0 = off)." },
  ],
};
