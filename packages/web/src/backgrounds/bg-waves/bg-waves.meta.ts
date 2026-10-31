import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-waves",
  name: "Liquid Waves",
  description: "Layered translucent sine waves undulate at different speeds and lean toward the pointer.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "canvas",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["waves","liquid","calm","canvas"],
  pageTypes: ["landing","onboarding"],
  inspiration: ["Aceternity Wavy Background"],
  a11y: "aria-hidden; static frame under reduced motion.",
  perf: "Three filled paths per frame.",
  status: "stable",
  priority: "P2",
  previewHeight: 320,
  props: [
    { name: "colors", type: "string[]", description: "Wave colors (back to front)." },
  ],
};
