import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "three-particle-morph",
  name: "Particle Morph",
  description: "Thousands of particles flow between shapes — sphere, torus, DNA helix, cube, wave — each easing at its own rate so the morph ripples instead of snapping.",
  category: "3d",
  platforms: ["web"],
  engine: "r3f",
  dependencies: ["three","@react-three/fiber","@react-three/drei"],
  registryDependencies: ["kinetik-core","canvas-3d-shell"],
  tags: ["three.js","particles","morph","hero","ai"],
  pageTypes: ["landing","ai-app"],
  inspiration: ["MotionSites — Particle Brain / Particle Self","three.js points examples"],
  a11y: "Canvas is decorative (keep meaningful copy in HTML). Under reduced motion the shell switches to an on-demand frameloop and renders one still frame.",
  perf: "One Points draw call; positions updated on the CPU (8k particles ≈ 0.3 ms). Lower `count` on mobile.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "shapes", type: "MorphShape[]", default: "all five", description: "Shapes to cycle through." },
    { name: "count", type: "number", default: "8000", description: "Particle count." },
    { name: "hold", type: "number", default: "3.2", description: "Seconds per shape." },
    { name: "colors", type: "[string, string]", default: "violet → cyan", description: "Gradient across particles." },
    { name: "onShapeChange", type: "(i) => void", description: "Fires when a morph starts." },
  ],
};
