import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-spotlight-grid",
  name: "Hero — Spotlight Grid",
  description: "Grid-lined hero lit by a cursor spotlight, with avatar social proof, a gradient headline and dual CTAs.",
  category: "heroes",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","grid","spotlight","saas","social proof"],
  pageTypes: ["landing"],
  inspiration: ["Linear / Vercel heroes"],
  a11y: "Spotlight is decorative; content is semantic; spotlight hidden under reduced motion.",
  perf: "CSS vars set on pointermove; no re-renders.",
  status: "stable",
  priority: "P1",
  previewHeight: 480,
  props: [
    { name: "avatars", type: "string[]", description: "Social proof avatars." },
  ],
};
