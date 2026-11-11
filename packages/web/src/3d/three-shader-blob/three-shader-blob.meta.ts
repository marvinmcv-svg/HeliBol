import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "three-shader-blob",
  name: "Shader Blob",
  description: "A living sphere — simplex-noise vertex displacement and a fresnel rim in a custom ShaderMaterial. Hover makes the surface boil; colours blend by noise height.",
  category: "3d",
  platforms: ["web"],
  engine: "r3f",
  dependencies: ["three","@react-three/fiber","@react-three/drei"],
  registryDependencies: ["kinetik-core","canvas-3d-shell"],
  tags: ["three.js","shader","glsl","blob","ai"],
  pageTypes: ["landing","ai-app"],
  inspiration: ["MotionSites — StellarMind / Nomi AI"],
  a11y: "Canvas is decorative (keep meaningful copy in HTML). Under reduced motion the shell switches to an on-demand frameloop and renders one still frame.",
  perf: "All deformation on the GPU (icosahedron detail 64); one draw call.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "colors", type: "[string, string, string]", default: "violet, pink, cyan", description: "Low, high and rim colours." },
    { name: "intensity", type: "number", default: "0.28", description: "Displacement amplitude." },
    { name: "speed", type: "number", default: "1", description: "Noise speed." },
  ],
};
