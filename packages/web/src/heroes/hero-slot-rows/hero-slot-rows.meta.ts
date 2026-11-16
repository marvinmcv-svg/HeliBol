import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-slot-rows",
  name: "Hero — Slot Rows",
  description: "Capability hero: pill-menu header, \"AI that\" in a ruled left column, a slot-reel of huge phrases that springs up one row at a time (current row in full ink), and a drifting \"Trusted by\" logo row.",
  category: "heroes",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","ai","slot","rotating words","rows","minimal"],
  pageTypes: ["ai-app","landing"],
  inspiration: ["Mobbin — Fourmula AI hero (mobbin.com/sites/sections/fb01406e-5120-4a8c-b80e-421743ec1fe1)"],
  a11y: "h1 includes all phrases in an sr-only span; the reel is aria-hidden; reduced motion stops the reel.",
  perf: "One spring-driven translateY on a short list.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
