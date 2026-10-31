import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "card-shine",
  name: "Shine Sweep Card",
  description: "A specular highlight sweeps diagonally across the card on hover — perfect for premium tiers and product tiles.",
  category: "cards",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["shine","premium","pricing","hover","css-only"],
  pageTypes: ["pricing","ecommerce"],
  inspiration: ["Apple Card","Stripe tiles"],
  a11y: "Focusable, same sweep on focus-visible; highlight hidden under reduced motion.",
  perf: "One skewed gradient span moving via `left`.",
  status: "stable",
  priority: "P2",
  previewHeight: 280,
  props: [
    { name: "children", type: "ReactNode", description: "Card content." },
  ],
};
