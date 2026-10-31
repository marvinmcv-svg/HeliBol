import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "card-hover-reveal",
  name: "Hover Reveal Card",
  description: "Image card: on hover or focus the photo zooms and dims while a details panel slides up from the bottom.",
  category: "cards",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["image","reveal","blog","hover","css-only"],
  pageTypes: ["blog","portfolio","ecommerce"],
  inspiration: ["Editorial blog grids"],
  a11y: "Focusable article; identical reveal on focus-visible; text is in the DOM from the start.",
  perf: "scale/filter + grid-rows transitions; 0 KB JS.",
  status: "stable",
  priority: "P2",
  previewHeight: 360,
  props: [
    { name: "image / title / subtitle", type: "string", description: "Content." },
    { name: "children", type: "ReactNode", description: "Revealed details." },
  ],
};
