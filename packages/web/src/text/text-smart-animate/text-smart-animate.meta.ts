import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-smart-animate",
  name: "Smart Animate Text",
  description: "Figma-style Smart Animate for words: letters shared between the old and new word glide to their new slots, new letters blur in and leftovers blur out.",
  category: "text",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["text","morph","anagram","layout","price"],
  pageTypes: ["landing","pricing"],
  inspiration: ["unlumen UI — Smart Animate Text"],
  a11y: "Real text lives in an sr-only aria-live span; animated glyphs are aria-hidden. Reduced motion: crossfade with no movement.",
  perf: "Layout animations on a handful of inline-block spans; popLayout keeps exits out of flow.",
  status: "stable",
  priority: "P1",
  previewHeight: 300,
  props: [
    { name: "words", type: "string[]", description: "Words to cycle through." },
    { name: "interval", type: "number", default: "2200", description: "ms per word." },
  ],
};
