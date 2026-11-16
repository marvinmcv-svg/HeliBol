import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-launch-timeline",
  name: "Hero — Launch Timeline",
  description: "Release-notes hero: a storefront preview whose banner swaps as a vertical schedule timeline ticks through each planned launch.",
  category: "heroes",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","release","schedule","timeline","store preview","a/b"],
  pageTypes: ["landing","ecommerce"],
  inspiration: ["Mobbin — Shopify Editions hero (mobbin.com/sites/sections/33c68013-8b30-48d6-a59e-a68f1162bbc6)"],
  a11y: "Schedule is an ordered list; banner text is real; reduced motion stops the auto-advance.",
  perf: "One interval; AnimatePresence crossfade of a single banner.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
