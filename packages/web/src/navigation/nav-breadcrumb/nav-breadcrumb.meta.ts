import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "nav-breadcrumb",
  name: "Animated Breadcrumb",
  description: "Breadcrumb where new segments slide in, removed ones collapse, and long paths fold the middle into an ellipsis.",
  category: "navigation",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["breadcrumb","path","navigation","files"],
  pageTypes: ["dashboard","docs"],
  inspiration: ["Finder path bar"],
  a11y: "nav aria-label=Breadcrumb, ordered list, aria-current on the last item.",
  perf: "Layout animation on a handful of items.",
  status: "stable",
  priority: "P3",
  previewHeight: 240,
  props: [
    { name: "path", type: "string[]", description: "Segments." },
    { name: "onNavigate", type: "(index) => void", description: "Click handler." },
    { name: "max", type: "number", default: "4", description: "Segments before collapsing." },
  ],
};
