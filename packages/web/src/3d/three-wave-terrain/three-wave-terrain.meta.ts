import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "three-wave-terrain",
  name: "Wave Terrain",
  description: "A rolling field of points displaced on the GPU, with a ripple that follows the cursor across the ground plane — press to amplify. Depth fog dissolves the horizon.",
  category: "3d",
  platforms: ["web"],
  engine: "r3f",
  dependencies: ["three","@react-three/fiber","@react-three/drei"],
  registryDependencies: ["kinetik-core","canvas-3d-shell"],
  tags: ["three.js","shader","terrain","points","data"],
  pageTypes: ["landing","dashboard"],
  inspiration: ["MotionSites — Moss Valley / Saffron Field"],
  a11y: "Canvas is decorative (keep meaningful copy in HTML). Under reduced motion the shell switches to an on-demand frameloop and renders one still frame.",
  perf: "~20k points, all motion in the vertex shader; the pointer is raycast onto a math plane (no mesh raycasting).",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "resolution", type: "number", default: "140", description: "Points per side." },
    { name: "size", type: "number", default: "18", description: "World size." },
    { name: "color", type: "string", default: "'#5eead4'", description: "Point colour." },
    { name: "fog", type: "string", default: "'#020617'", description: "Horizon colour." },
  ],
};
