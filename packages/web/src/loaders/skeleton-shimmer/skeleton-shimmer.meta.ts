import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "skeleton-shimmer",
  name: "Skeleton Shimmer",
  description: "Theme-aware skeleton blocks with a soft sweeping highlight. Shape them with Tailwind classes to match your layout.",
  category: "loaders",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["skeleton", "loading", "placeholder", "css-only"],
  pageTypes: ["dashboard", "blog", "ecommerce"],
  inspiration: ["Facebook / YouTube skeletons", "shadcn Skeleton"],
  a11y: "Skeletons are aria-hidden; put aria-busy on the loading container. Reduced motion: static blocks.",
  perf: "translate on a pseudo-element; 0 KB JS.",
  status: "stable",
  priority: "P1",
  previewHeight: 340,
  props: [{ name: "className", type: "string", description: "Size/shape (h-4 w-32 rounded-full …)." }],
};
