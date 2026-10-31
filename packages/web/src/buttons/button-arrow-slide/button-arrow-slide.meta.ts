import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "button-arrow-slide",
  name: "Arrow Slide Button",
  description: "Hover sweeps a fill in from the left, nudges the label and swaps the arrow out to the right as a new one slides in.",
  category: "buttons",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["cta","arrow","hover","agency","css-only"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["Agency CTAs on Awwwards"],
  a11y: "Native button; same effect on focus-visible; transitions off under reduced motion.",
  perf: "Transforms only, 0 KB JS.",
  status: "stable",
  priority: "P2",
  previewHeight: 220,
  props: [
    { name: "...props", type: "ButtonHTMLAttributes", description: "Native button props." },
  ],
};
