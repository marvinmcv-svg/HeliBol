import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-orb-clients",
  name: "Hero — Orb + Client Cards",
  description: "Agency hero: wordmark and small nav, a soft coral orb glowing behind huge frosted pill CTAs, and a row of client case cards — each with a tiny site preview — fanning in.",
  category: "heroes",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","agency","orb","conic gradient","case studies","cards"],
  pageTypes: ["portfolio","landing"],
  inspiration: ["Mobbin — OFF+BRAND hero (mobbin.com/sites/sections/0b70740a-eb7a-415b-b48d-09d66ce3ec38)"],
  a11y: "Intro copy is the h1; cards are list items with real links; reduced motion stops the orb and skips card entrance.",
  perf: "One blurred conic orb animating an @property angle; three Motion entrances.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
