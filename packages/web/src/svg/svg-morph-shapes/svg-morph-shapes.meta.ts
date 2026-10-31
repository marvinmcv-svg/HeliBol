import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "svg-morph-shapes",
  name: "Shape Morph",
  description: "Gradient shape that springs between blob, star, heart and square — paths share 8 cubic segments so they interpolate cleanly.",
  category: "svg",
  platforms: ["web"],
  engine: "svg",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["morph","svg","shapes","blob"],
  pageTypes: ["landing","onboarding"],
  inspiration: ["GSAP MorphSVG","Flubber"],
  a11y: "role=img with the current shape named; instant under reduced motion.",
  perf: "One path `d` spring.",
  status: "stable",
  priority: "P2",
  previewHeight: 280,
  props: [
    { name: "sequence", type: "string[]", description: "Shapes to cycle." },
    { name: "interval", type: "number", default: "1800", description: "ms per shape." },
  ],
};
