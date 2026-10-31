import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "nav-sidebar",
  name: "Collapsible Sidebar",
  description: "App sidebar that springs between full width and an icon rail, with a gliding active indicator, badges and native tooltips.",
  category: "navigation",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["sidebar","app shell","collapse","dashboard"],
  pageTypes: ["dashboard","settings"],
  inspiration: ["Linear","Notion sidebar"],
  a11y: "aria-current on the active item; collapsed items keep aria-label + title.",
  perf: "Width spring on one element; labels fade.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "items", type: "{ icon, label, badge? }[]", description: "Nav items." },
    { name: "brand", type: "ReactNode", description: "Logo text." },
  ],
};
