import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-pixel-wave",
  name: "Background — Pixel Wave",
  description: "A grid of square pixels driven by interfering sine waves — each cell's size and colour follow the wave height. Clicks (and an occasional automatic drop) send expanding rings across the grid, and the pointer leaves a soft bulge.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "canvas",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","background","canvas","pixels","wave","ripple","interactive"],
  pageTypes: ["landing","ai-app"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Canvas is aria-hidden; content sits above it. Reduced motion draws one still frame.",
  perf: "Single 2D canvas via useCanvas: DPR-aware, paused off-screen and in background tabs.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "children", type: "ReactNode", description: "Content above the grid." },
    { name: "cell", type: "number", default: "14", description: "Cell size in px." },
    { name: "colors", type: "[string, string]", default: "indigo → cyan", description: "Low/high colours." },
  ],
};
