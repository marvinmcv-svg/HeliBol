import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "three-floating-shapes",
  name: "Floating Shapes",
  description: "Playful clay-like primitives bobbing in a soft studio — pointer parallax, hover swell, contact shadows.",
  category: "3d",
  platforms: ["web"],
  engine: "r3f",
  dependencies: ["three","@react-three/fiber","@react-three/drei"],
  registryDependencies: ["kinetik-core","canvas-3d-shell"],
  tags: ["three.js","playful","hero","shapes","clay"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["MotionSites — Jelly Garden"],
  a11y: "Canvas is decorative (keep meaningful copy in HTML). Under reduced motion the shell switches to an on-demand frameloop and renders one still frame.",
  perf: "14 meshes with physical materials; ContactShadows rendered once per frame at low res.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "palette", type: "string[]", default: "candy", description: "Colours used round-robin." },
    { name: "count", type: "number", default: "14", description: "Number of shapes." },
  ],
};
