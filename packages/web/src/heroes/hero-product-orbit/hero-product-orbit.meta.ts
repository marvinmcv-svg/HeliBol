import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-product-orbit",
  name: "Hero — Product Orbit",
  description: "Product hero with feature chips riding a tilted 3D ellipse around the product: chips in front are larger and sharp, chips behind shrink, blur and pass behind it. The orbit tilts toward the pointer; hovering a chip pauses it.",
  category: "heroes",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","hero","orbit","features","saas","3d"],
  pageTypes: ["landing"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Chips are decorative labels; the feature list should also exist as text elsewhere. Reduced motion: static orbit.",
  perf: "One angle motion value; chip positions via useTransform (no React renders per frame).",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "product", type: "ReactNode", description: "Centre visual." },
    { name: "chips", type: "{ icon, label }[]", description: "Orbiting chips." },
    { name: "children", type: "ReactNode", description: "Headline." },
  ],
};
