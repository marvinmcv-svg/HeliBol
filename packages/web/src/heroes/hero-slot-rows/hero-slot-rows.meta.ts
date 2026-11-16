import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-slot-rows",
  name: "Hero — Slot Rows",
  description: "Capability hero: \"AI that\" on the left; on the right a ruled stack of huge phrases rolls upward like a slot reel, the centred row in full ink.",
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
