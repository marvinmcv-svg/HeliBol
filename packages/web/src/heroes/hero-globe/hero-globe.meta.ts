import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-globe",
  name: "Hero — Dotted Globe",
  description: "Canvas dotted globe (orthographic projection, no WebGL) that rotates, tilts toward the pointer and draws travelling arcs between cities.",
  category: "heroes",
  platforms: ["web"],
  engine: "canvas",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["globe","map","canvas","global","network"],
  pageTypes: ["landing"],
  inspiration: ["Magic UI Globe (cobe)","GitHub globe"],
  a11y: "Canvas has role=img and a description; static frame under reduced motion.",
  perf: "~800 dots + arcs on a 2D canvas; pauses off-screen.",
  status: "stable",
  priority: "P2",
  previewHeight: 460,
  props: [
    { name: "arcs", type: "{ from: [lat, lon], to: [lat, lon] }[]", description: "Connections." },
    { name: "color", type: "string", description: "Dot RGB." },
  ],
};
