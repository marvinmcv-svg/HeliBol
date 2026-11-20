import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "loader-skeleton-morph",
  name: "Skeleton → Content Morph",
  description: "Skeleton placeholders that dissolve with a blur while the real content resolves in from a blur in the same box — no layout jump — with a shimmer sweeping across the bars while loading.",
  category: "loaders",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","skeleton","loading","shimmer","blur","placeholder"],
  pageTypes: ["dashboard","social","blog"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Container toggles aria-busy; skeleton is aria-hidden. Reduced motion stops the shimmer and cross-fades.",
  perf: "Grid stacking keeps both states in one cell; filter only during the swap.",
  status: "stable",
  priority: "P1",
  previewHeight: 380,
  props: [
    { name: "loaded", type: "boolean", description: "Show content." },
    { name: "children", type: "ReactNode", description: "Real content." },
    { name: "rows", type: "number[]", default: "[70,45,90,80]", description: "Bar widths %." },
    { name: "avatar", type: "boolean", default: "true", description: "Show avatar row." },
  ],
};
