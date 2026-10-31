import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "card-neon",
  name: "Neon Gradient Card",
  description: "A two-tone neon gradient border that slowly rotates, with a matching bloom glowing behind the card.",
  category: "cards",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["neon","glow","border","dark"],
  pageTypes: ["landing","pricing"],
  inspiration: ["Magic UI Neon Gradient Card"],
  a11y: "Decorative; animation stops under reduced motion.",
  perf: "Registered @property angle; blur on a pseudo-element.",
  status: "stable",
  priority: "P2",
  previewHeight: 320,
  props: [
    { name: "from / to", type: "string", description: "Neon colors." },
  ],
};
