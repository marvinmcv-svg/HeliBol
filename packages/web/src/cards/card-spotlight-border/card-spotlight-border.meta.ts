import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "card-spotlight-border",
  name: "Spotlight Border Cards",
  description: "Card borders light up near the cursor, and the glow flows continuously across neighbouring cards in the grid.",
  category: "cards",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["cards", "border", "glow", "features", "cursor"],
  pageTypes: ["landing", "pricing", "dashboard"],
  inspiration: ["Linear features grid", "Vercel cards"],
  a11y: "Decorative glow; card content unchanged. Hidden under reduced motion; ignores touch.",
  perf: "One grid-level pointer listener writes CSS vars per card; all rendering is CSS gradients.",
  status: "stable",
  priority: "P1",
  previewHeight: 340,
  props: [
    { name: "SpotlightBorderGrid.color", type: "string", description: "Glow color." },
    { name: "SpotlightBorderCard", type: "component", description: "A card inside the grid." },
  ],
};
