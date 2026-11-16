import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-halo-event",
  name: "Hero — Halo Event",
  description: "Keynote/event hero: a luminous iridescent halo grows out of a blue field and keeps rotating, with a one-line announcement and single pill CTA.",
  category: "heroes",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","event","keynote","iridescent","ring","glow"],
  pageTypes: ["landing"],
  inspiration: ["Mobbin — Apple hero (mobbin.com/sites/sections/a422ddf7-b4db-410a-8778-1fbbf965f0a4)"],
  a11y: "Real h1 and link; halo aria-hidden; reduced motion freezes the ring.",
  perf: "Masked conic gradient animating an @property angle; two blur layers.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
