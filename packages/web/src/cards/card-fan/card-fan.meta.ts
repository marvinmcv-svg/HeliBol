import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "card-fan",
  name: "Card Fan",
  description: "A tidy stack that fans out like a hand of cards on hover/focus; the card under the pointer lifts and comes forward.",
  category: "cards",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["fan","stack","spread","photos"],
  pageTypes: ["portfolio","landing","social"],
  inspiration: ["Animata card spread"],
  a11y: "Each card is focusable; fan opens on focus.",
  perf: "Transforms only on ≤6 cards.",
  status: "stable",
  priority: "P2",
  previewHeight: 380,
  props: [
    { name: "items", type: "ReactNode[]", description: "Cards." },
  ],
};
