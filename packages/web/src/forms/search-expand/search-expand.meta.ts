import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "search-expand",
  name: "Expanding Search",
  description: "Search icon that springs open into a full field and collapses when empty and blurred; '/' focuses it from anywhere.",
  category: "forms",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["search","input","expand","toolbar"],
  pageTypes: ["dashboard","docs","ecommerce"],
  inspiration: ["Apple / Vercel search fields"],
  a11y: "role=search form; labelled input and buttons; Esc clears and collapses.",
  perf: "Width spring on one element.",
  status: "stable",
  priority: "P2",
  previewHeight: 240,
  props: [
    { name: "placeholder", type: "string", description: "Placeholder." },
    { name: "onSearch", type: "(q) => void", description: "Submit handler." },
  ],
};
