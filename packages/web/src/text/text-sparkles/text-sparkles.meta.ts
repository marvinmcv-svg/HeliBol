import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-sparkles",
  name: "Sparkle Text",
  description: "Four-point stars twinkle in and out around a word — for 'magic' moments, upgrades and AI features.",
  category: "text",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["sparkles","magic","ai","highlight"],
  pageTypes: ["landing","pricing","ai-app"],
  inspiration: ["Josh Comeau sparkles","Magic UI Sparkles Text"],
  a11y: "Sparkles are aria-hidden SVGs; none rendered under reduced motion.",
  perf: "~8 small SVGs; one replaced every 420ms.",
  status: "stable",
  priority: "P2",
  previewHeight: 240,
  props: [
    { name: "colors", type: "string[]", description: "Sparkle colors." },
    { name: "count", type: "number", default: "8", description: "Sparkles alive at once." },
  ],
};
