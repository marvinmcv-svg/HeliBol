import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "like-burst",
  name: "Like Burst",
  description: "Twitter-style heart: squash-and-pop, an expanding ring, a confetti of particles and a rolling counter.",
  category: "buttons",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["like", "heart", "social", "particles", "delight"],
  pageTypes: ["blog", "ecommerce", "portfolio"],
  inspiration: ["Twitter/X like animation", "Instagram double-tap"],
  a11y: "aria-pressed toggle with Like/Unlike label. Reduced motion: color change only.",
  perf: "10 particles mount only on like and unmount after 0.6s.",
  status: "stable",
  priority: "P1",
  previewHeight: 340,
  props: [
    { name: "liked", type: "boolean", description: "Controlled state." },
    { name: "onChange", type: "(liked) => void", description: "Toggle callback." },
    { name: "count", type: "number", description: "Optional counter that rolls up/down." },
    { name: "color", type: "string", default: '"#f43f5e"', description: "Heart color." },
  ],
};
