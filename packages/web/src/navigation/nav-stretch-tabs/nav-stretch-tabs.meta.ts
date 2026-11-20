import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "nav-stretch-tabs",
  name: "Tabs — Stretch Indicator",
  description: "Tabs whose pill indicator moves like a caterpillar: the leading edge springs toward the new tab first while the trailing edge lags and catches up, so the pill stretches across the gap and snaps back.",
  category: "navigation",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","tabs","indicator","segmented","stretch","navigation"],
  pageTypes: ["dashboard","settings","landing"],
  inspiration: ["kinetik Premium collection"],
  a11y: "role=tablist with roving tabindex and arrow-key navigation. Reduced motion jumps the indicator.",
  perf: "Two motion values (left/right edges) on one absolutely positioned span.",
  status: "stable",
  priority: "P1",
  previewHeight: 320,
  props: [
    { name: "tabs", type: "string[]", description: "Tab labels." },
    { name: "defaultIndex", type: "number", default: "0", description: "Initial tab." },
    { name: "onChange", type: "(i: number) => void", description: "Selection callback." },
  ],
};
