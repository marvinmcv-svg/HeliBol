import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-flicker-grid",
  name: "Flickering Grid",
  description: "Canvas grid of tiny squares that randomly flicker in brightness under a radial vignette — a quiet data texture.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "canvas",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["grid","canvas","flicker","texture","hero"],
  pageTypes: ["landing","dashboard"],
  inspiration: ["Magic UI Flickering Grid"],
  a11y: "aria-hidden canvas; renders one static frame under reduced motion.",
  perf: "Single 2D canvas; pauses off-screen and in hidden tabs (useCanvas).",
  status: "stable",
  priority: "P2",
  previewHeight: 300,
  props: [
    { name: "square / gap", type: "number", default: "4 / 6", description: "Cell size and spacing (px)." },
    { name: "color", type: "string", default: "\"139 92 246\"", description: "RGB triplet." },
    { name: "flicker", type: "number", default: "0.3", description: "Change probability per second." },
    { name: "maxOpacity", type: "number", default: "0.35", description: "Brightest cell." },
  ],
};
