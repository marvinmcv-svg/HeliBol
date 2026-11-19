import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-framed-peak",
  name: "Hero — Framed Peak",
  description: "Foundation/mission hero: lavender nav, a rounded alpine photo card with a hiker climbing and a white square frame drawing itself around the name, then the mission copy.",
  category: "heroes",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","mission","mountain","frame","path draw","parallax"],
  pageTypes: ["landing"],
  inspiration: ["Mobbin — Proton hero (mobbin.com/sites/sections/956e25ca-0763-4b15-9ff1-8300cd706f4c)"],
  a11y: "Real h1 inside the scene; SVG is aria-hidden; reduced motion places the hiker statically and shows the frame drawn.",
  perf: "Two transform loops, one stroke draw, one SMIL animateMotion.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
