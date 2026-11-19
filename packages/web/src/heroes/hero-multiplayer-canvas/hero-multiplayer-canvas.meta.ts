import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-multiplayer-canvas",
  name: "Hero — Multiplayer Canvas",
  description: "AI site-builder hero on a design canvas: product nav, a violet selection frame with handles, site thumbnails bleeding off both edges, wandering multiplayer cursors, a light display headline and a rainbow-ringed prompt bar.",
  category: "heroes",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","ai","canvas","cursors","multiplayer","prompt"],
  pageTypes: ["ai-app","landing"],
  inspiration: ["Mobbin — Relume hero (mobbin.com/sites/sections/1364f3d6-53a9-47e6-8961-c8abd80766ae)"],
  a11y: "Labelled input, real button and h1; canvas chrome, cursors and thumbnails aria-hidden; reduced motion freezes them.",
  perf: "Two cursor transform loops, one gradient-position loop.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
