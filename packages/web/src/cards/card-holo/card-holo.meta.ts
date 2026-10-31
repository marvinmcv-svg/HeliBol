import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "card-holo",
  name: "Holographic Foil Card",
  description: "Collectible-card foil: rainbow sheen, glare and tilt all track the pointer through CSS variables.",
  category: "cards",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["holographic","foil","tilt","collectible","glare"],
  pageTypes: ["ecommerce","portfolio","social"],
  inspiration: ["Pokémon card CSS (simeydotme)","React Bits Holo Card"],
  a11y: "Purely decorative layers (aria-hidden); off on touch and reduced motion.",
  perf: "Pointer handler writes CSS vars; no React re-renders.",
  status: "stable",
  priority: "P2",
  previewHeight: 420,
  props: [
    { name: "children", type: "ReactNode", description: "Card content." },
  ],
};
