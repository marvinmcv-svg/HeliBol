import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "svg-path-draw",
  name: "SVG Path Draw",
  description: "Every stroke inside an SVG draws itself — once on view, or scrubbed with scroll — with GSAP DrawSVG. Illustrations, signatures, diagrams.",
  category: "svg",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap", "@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["svg", "draw", "line art", "signature", "scroll"],
  pageTypes: ["landing", "portfolio", "blog"],
  inspiration: ["GSAP DrawSVG", "Stripe illustrations"],
  a11y: "Add role=img + aria-label (or <title>) to meaningful illustrations; decorative ones aria-hidden. Reduced motion: drawn immediately.",
  perf: "stroke-dashoffset only; works on any shape type (path, line, circle, rect…).",
  status: "stable",
  priority: "P1",
  previewHeight: 280,
  props: [
    { name: "viewBox", type: "string", description: "SVG viewBox." },
    { name: "mode", type: '"view" | "scrub"', default: '"view"', description: "Play once or scrub with scroll." },
    { name: "duration / stagger", type: "number", default: "1.6 / 0.15", description: "Timing (s)." },
  ],
};
