import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-morph",
  name: "Morphing Text",
  description: "Words melt into each other: two layers cross-blur while an SVG threshold filter fuses their edges into liquid letterforms.",
  category: "text",
  platforms: ["web"],
  engine: "svg",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["morph","liquid","hero","rotating","svg filter"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["Magic UI Morphing Text","CodePen gooey text"],
  a11y: "All words exposed once via aria-label; visual layers are aria-hidden. Reduced motion: words swap instantly.",
  perf: "One rAF loop updating two filters; pauses with the tab (rAF).",
  status: "stable",
  priority: "P2",
  previewHeight: 280,
  props: [
    { name: "words", type: "string[]", description: "Words to cycle." },
    { name: "morphTime", type: "number", default: "1", description: "Seconds per morph." },
    { name: "holdTime", type: "number", default: "1.6", description: "Seconds each word holds." },
  ],
};
