import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-dot-glow",
  name: "Glowing Dot Matrix",
  description: "Dots near the cursor swell and glow in the accent color while an ambient wave ripples across the matrix.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "canvas",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["dots","glow","interactive","canvas"],
  pageTypes: ["landing","ai-app"],
  inspiration: ["Magic UI Dot Pattern","React Bits Dot Grid"],
  a11y: "aria-hidden; one frame under reduced motion.",
  perf: "One arc per dot per frame; increase `gap` on large areas.",
  status: "stable",
  priority: "P2",
  previewHeight: 300,
  props: [
    { name: "gap", type: "number", default: "22", description: "Dot spacing." },
    { name: "radius", type: "number", default: "160", description: "Pointer influence (px)." },
    { name: "color", type: "string", description: "Glow RGB." },
  ],
};
