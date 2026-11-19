import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "nav-morph-tabbar",
  name: "Morphing Tab Bar",
  description: "Mobile tab bar where the active tab grows into a coloured pill that reveals its label: the pill slides (shared layout) and changes colour, the label unfurls, the icon hops.",
  category: "navigation",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","tab bar","mobile","navigation","pill","bottom nav"],
  pageTypes: ["social","dashboard"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Buttons with aria-label and aria-current. Reduced motion: instant.",
  perf: "layoutId pill + width animation on one label.",
  status: "stable",
  priority: "P1",
  previewHeight: 300,
  props: [
    { name: "tabs", type: "{ label, icon, color? }[]", description: "Tabs." },
    { name: "defaultIndex", type: "number", default: "0", description: "Active tab." },
    { name: "onChange", type: "(i) => void", description: "Callback." },
  ],
};
