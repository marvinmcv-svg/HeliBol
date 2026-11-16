import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-dream-arches",
  name: "Hero — Dream Arches",
  description: "Studio hero: a surreal pastel room — a tall arch onto lavender hills, a doorway to the sky, a stair rising out of still water, rocks and a floating pearl — under an italic-serif + sans headline.",
  category: "heroes",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","studio","surreal","pastel","serif","3d look"],
  pageTypes: ["portfolio","landing"],
  inspiration: ["Mobbin — Unseen Studio hero (mobbin.com/sites/sections/1bdc4e01-2f7e-4e09-9aa1-27f02c13bcbe)"],
  a11y: "Real h1 with serif and sans spans; scene is aria-hidden; reduced motion freezes clouds, ripples and the pearl.",
  perf: "All CSS shapes; a handful of transform loops.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
