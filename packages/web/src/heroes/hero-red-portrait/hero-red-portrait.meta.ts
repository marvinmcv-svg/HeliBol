import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-red-portrait",
  name: "Hero — Red Portrait",
  description: "Digital-agency hero: a monochrome red portrait silhouette with projected blue light points drifting across it and a cyan serif wordmark wiping in.",
  category: "heroes",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","agency","portrait","duotone","serif","light dots"],
  pageTypes: ["portfolio"],
  inspiration: ["Mobbin — Locomotive hero (mobbin.com/sites/sections/6a2f519f-af72-4525-a6ca-2ef3457bdf63)"],
  a11y: "Real h1 tagline; the face is decorative CSS and aria-hidden; reduced motion stops drift, breathing and the spinning asterisk.",
  perf: "CSS radial shapes + 16 glowing dots with transform loops.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
