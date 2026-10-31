import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-split-flap",
  name: "Split-Flap Board",
  description: "Airport departure board: every cell flaps through the character set until it lands on its target text.",
  category: "text",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["split flap","airport","retro","ticker","board"],
  pageTypes: ["landing","dashboard"],
  inspiration: ["Solari boards","React Bits Split Flap Text"],
  a11y: "Exposes the final value via aria-label; cells aria-hidden. Reduced motion: shows the value immediately.",
  perf: "One interval per board; text-only updates.",
  status: "stable",
  priority: "P2",
  previewHeight: 300,
  props: [
    { name: "value", type: "string", description: "Target text." },
    { name: "speed", type: "number", default: "45", description: "ms per flap step." },
  ],
};
