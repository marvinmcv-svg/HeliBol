import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "cursor-crosshair",
  name: "Crosshair Cursor",
  description: "Full-bleed crosshair lines track the pointer with a live x/y readout — design tools and technical brands.",
  category: "cursor",
  platforms: ["web"],
  engine: "js",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["crosshair","coordinates","design tool","technical"],
  pageTypes: ["portfolio","docs"],
  inspiration: ["Figma rulers","React Bits Crosshair"],
  a11y: "Overlay is aria-hidden; off on touch/reduced motion.",
  perf: "Two 1px lines positioned per move.",
  status: "stable",
  priority: "P3",
  previewHeight: 300,
  props: [
    { name: "children", type: "ReactNode", description: "Area content." },
  ],
};
