import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-flip-filter",
  name: "Flip Filter Grid",
  description: "Filter chips re-arrange a grid with GSAP Flip — survivors glide to their new cells, new items pop in and removed ones shrink away.",
  category: "layout",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["flip","filter","grid","gallery","layout"],
  pageTypes: ["ecommerce","portfolio","blog"],
  inspiration: ["GSAP Demo Hub — Flexbox filtering"],
  a11y: "Chips are toggle buttons with aria-pressed in a labelled toolbar; reduced motion changes instantly.",
  perf: "Flip.from with absolute + scale; display toggled, no re-render needed.",
  status: "stable",
  priority: "P1",
  previewHeight: 460,
  props: [
    { name: "items", type: "{ id, tags, node }[]", description: "Items." },
    { name: "filters", type: "string[]", description: "Filter names (All is added)." },
  ],
};
