import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-odometer",
  name: "Odometer Number",
  description: "Each digit is a vertical reel that springs to its new number — the slot-machine counter for live stats and prices.",
  category: "text",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["number","counter","odometer","live","stats","pricing"],
  pageTypes: ["dashboard","landing","pricing"],
  inspiration: ["Motion Primitives Sliding Number","NumberFlow"],
  a11y: "aria-label holds the formatted value; reels aria-hidden. Reduced motion: instant.",
  perf: "One transform per digit; keyed by place value so unchanged digits don't move.",
  status: "stable",
  priority: "P1",
  previewHeight: 280,
  props: [
    { name: "value", type: "number", description: "Number to show." },
    { name: "format", type: "Intl.NumberFormatOptions", description: "Formatting (currency, compact…)." },
  ],
};
