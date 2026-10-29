import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "auto-animate-list",
  name: "Auto-Animate List",
  description: "Add, remove and shuffle items and everything animates: entries pop in, exits blur out, siblings slide into the gap.",
  category: "layout",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["list", "add remove", "layout", "product ui"],
  pageTypes: ["dashboard", "settings", "ecommerce"],
  inspiration: ["FormKit AutoAnimate", "Sonner stacks"],
  a11y: "Plain list semantics; remove buttons are labelled. Reduced motion handled globally by MotionConfig.",
  perf: "popLayout removes exiting items from layout immediately so siblings animate in parallel.",
  status: "stable",
  priority: "P1",
  previewHeight: 400,
  props: [
    { name: "items", type: "T[]", description: "Items in display order." },
    { name: "getKey", type: "(item) => string", description: "Stable key." },
    { name: "render", type: "(item) => ReactNode", description: "Row renderer." },
  ],
};
