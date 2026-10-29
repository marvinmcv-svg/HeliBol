import type { ComponentMeta } from "@web/types";

export const meta: ComponentMeta = {
  id: "pricing-toggle",
  name: "Pricing — Period Toggle",
  description: "Three-tier pricing with a sliding Monthly/Yearly toggle; prices roll vertically to the new value and the savings badge lights up.",
  category: "layout",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion", "lucide-react"],
  registryDependencies: ["kinetik-core", "animated-tabs", "button-shimmer", "button-press"],
  tags: ["pricing", "toggle", "plans", "saas"],
  pageTypes: ["pricing", "landing"],
  a11y: "Toggle is an ARIA tablist; prices are text; badge isn't color-only.",
  perf: "Only changed digits animate.",
  status: "stable",
  priority: "P1",
  previewHeight: 640,
};
