import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bento-grid",
  name: "Bento Grid",
  description: "Apple-style bento layout where each tile's visual lifts and a CTA slides in on hover or keyboard focus.",
  category: "cards",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["bento", "features", "grid", "landing", "css-only"],
  pageTypes: ["landing", "portfolio"],
  inspiration: ["Apple keynote bento slides", "Magic UI Bento Grid"],
  a11y: "Tiles are focusable and reveal the same content on focus-within as on hover.",
  perf: "CSS transitions only; put any heavier per-tile animation behind in-view.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "BentoTile.title / description", type: "string", description: "Copy." },
    { name: "BentoTile.visual", type: "ReactNode", description: "Upper visual / micro-animation." },
    { name: "className", type: "string", description: "Use col-span-* / row-span-* for layout." },
  ],
};
