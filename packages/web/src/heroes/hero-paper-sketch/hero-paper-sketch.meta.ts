import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-paper-sketch",
  name: "Hero — Paper Sketch",
  description: "Device hero in a warm cinematic frame: a tilted paper-like tablet sketches an engraving stroke by stroke while serif copy and features rise.",
  category: "heroes",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","device","e-ink","sketch","cinematic","features"],
  pageTypes: ["landing","ecommerce"],
  inspiration: ["Mobbin — Daylight hero (mobbin.com/sites/sections/b9729ea8-5d0f-4cd1-bd67-77d6f9d835e0)"],
  a11y: "Real h1 and feature copy; tablet aria-hidden; reduced motion shows the finished sketch.",
  perf: "~14 stroke draws once; one slow tilt loop.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
