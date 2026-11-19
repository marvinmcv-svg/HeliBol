import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-pixel-logos",
  name: "Hero — Pixel Logos",
  description: "Enterprise-AI hero in a ruled grid: bordered cell nav, hopping pixel-art mascots, a word-by-word headline, a drifting row of tall logo cells and a strip of customer stories.",
  category: "heroes",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","enterprise","pixel art","logo grid","marquee","ai"],
  pageTypes: ["landing","ai-app"],
  inspiration: ["Mobbin — Mistral AI hero (mobbin.com/sites/sections/e6e87f69-8f6e-42cd-adb6-99a06f281082)"],
  a11y: "Words are spans inside a real h1; sprites and duplicate cells aria-hidden; reduced motion stops hops, word rise and cell drift.",
  perf: "Three tiny crisp-edged SVG sprites; one marquee.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
