import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "three-instanced-grid",
  name: "Instanced Pillar Grid",
  description: "A field of 1,296 pillars (one InstancedMesh) that rise and glow under the cursor and breathe gently at rest.",
  category: "3d",
  platforms: ["web"],
  engine: "r3f",
  dependencies: ["three","@react-three/fiber","@react-three/drei"],
  registryDependencies: ["kinetik-core","canvas-3d-shell"],
  tags: ["three.js","instanced","grid","hover","data"],
  pageTypes: ["landing","dashboard"],
  inspiration: ["three.js instancing examples"],
  a11y: "Canvas is decorative (keep meaningful copy in HTML). Under reduced motion the shell switches to an on-demand frameloop and renders one still frame.",
  perf: "One draw call; per-frame matrix updates for ~1.3k instances. The pointer is raycast onto a plane.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "size", type: "number", default: "36", description: "Grid side." },
    { name: "color", type: "string", default: "'#27272a'", description: "Base colour." },
    { name: "accent", type: "string", default: "'#a3e635'", description: "Hot colour." },
    { name: "radius", type: "number", default: "4", description: "Influence radius (cells)." },
  ],
};
