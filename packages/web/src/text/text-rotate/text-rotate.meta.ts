import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-rotate",
  name: "Rotating Word",
  description: "A word inside a sentence rolls to the next option while its container smoothly resizes to fit — no layout jump.",
  category: "text",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["hero", "headline", "rotating", "layout"],
  pageTypes: ["landing"],
  inspiration: ["Fancy Components Text Rotate", "Vercel headlines"],
  a11y: "All options exposed once through sr-only text; animated word is aria-hidden. Reduced motion: crossfade only.",
  perf: "Uses Motion layout for width; one element animates at a time.",
  status: "stable",
  priority: "P1",
  previewHeight: 260,
  props: [
    { name: "words", type: "string[]", description: "Words to rotate." },
    { name: "interval", type: "number", default: "2200", description: "ms per word." },
    { name: "paused", type: "boolean", description: "Stop rotating." },
  ],
};
