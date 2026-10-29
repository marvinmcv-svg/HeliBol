import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "animated-tabs",
  name: "Animated Tabs",
  description: "A shared-layout indicator (pill or underline) glides between tabs while panels slide in the direction of travel.",
  category: "layout",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["tabs", "segmented", "layoutId", "navigation"],
  pageTypes: ["dashboard", "pricing", "docs", "settings"],
  inspiration: ["Vercel dashboard tabs", "Apple segmented controls"],
  a11y: "Full WAI-ARIA tabs pattern: roving tabindex, ←/→ keys, aria-selected/controls/labelledby.",
  perf: "One layoutId element per tab group (useId-scoped so multiple groups don't collide).",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "tabs", type: "{ id, label, content? }[]", description: "Tab definitions; content optional (indicator-only usage)." },
    { name: "variant", type: '"pill" | "underline"', default: '"pill"', description: "Indicator style." },
    { name: "defaultTab", type: "string", description: "Initially selected id." },
    { name: "onChange", type: "(id) => void", description: "Selection callback." },
  ],
};
