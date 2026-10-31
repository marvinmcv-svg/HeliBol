import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-topography",
  name: "Topographic Lines",
  description: "Procedural contour-map lines with slowly marching dashes — outdoors, maps and data brands.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "svg",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["topography","contour","svg","map"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["Topographic map art"],
  a11y: "aria-hidden SVG; dashes stop under reduced motion.",
  perf: "Static SVG paths; only stroke-dashoffset animates.",
  status: "stable",
  priority: "P2",
  previewHeight: 300,
  props: [
    { name: "lines", type: "number", default: "14", description: "Contours." },
  ],
};
