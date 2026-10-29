import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-blur-in",
  name: "Blur In Text",
  description: "Words (or characters) fade up while un-blurring, staggered — the soft, Apple-keynote style entrance.",
  category: "text",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["hero", "subtitle", "soft", "in-view"],
  pageTypes: ["landing", "portfolio", "onboarding"],
  inspiration: ["Magic UI Blur Fade", "Apple product pages"],
  a11y: "Wrapper carries aria-label with the full sentence; fragments are aria-hidden. Reduced motion: opacity only.",
  perf: "filter blur is GPU-composited but costly on huge text; keep to headlines.",
  status: "stable",
  priority: "P1",
  previewHeight: 300,
  props: [
    { name: "children", type: "string", description: "Text to animate." },
    { name: "by", type: '"words" | "chars"', default: '"words"', description: "Stagger unit." },
    { name: "delay", type: "number", default: "0", description: "Delay before the first fragment (s)." },
    { name: "duration", type: "number", default: "0.48", description: "Per-fragment duration (s)." },
    { name: "once", type: "boolean", default: "true", description: "Only animate the first time it enters view." },
  ],
};
