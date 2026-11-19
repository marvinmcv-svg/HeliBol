import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "three-metaballs",
  name: "Liquid Metaballs",
  description: "Glossy liquid metaballs (marching cubes) drift on looping paths and merge like lava-lamp wax; an extra blob follows the pointer so you can pull the liquid around. Colours blend where blobs meet.",
  category: "3d",
  platforms: ["web"],
  engine: "r3f",
  dependencies: ["three","@react-three/fiber","@react-three/drei"],
  registryDependencies: ["kinetik-core","canvas-3d-shell"],
  tags: ["premium","three.js","metaballs","liquid","blob","hero"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Canvas is decorative. Reduced motion: frozen blobs, no pointer blob, still frame.",
  perf: "drei MarchingCubes at resolution 56 (lower on mobile); paused off-screen.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "colors", type: "string[]", default: "5 candy colours", description: "One blob per colour." },
    { name: "resolution", type: "number", default: "56", description: "Grid resolution." },
  ],
};
