import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "three-glass-shape",
  name: "Glass Shape",
  description: "A refracting glass object (drei MeshTransmissionMaterial) floating in front of coloured shapes — real refraction, chromatic dispersion, faceted or smooth cut — tilting toward the pointer.",
  category: "3d",
  platforms: ["web"],
  engine: "r3f",
  dependencies: ["three","@react-three/fiber","@react-three/drei"],
  registryDependencies: ["kinetik-core","canvas-3d-shell"],
  tags: ["three.js","glass","refraction","hero","premium"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["MotionSites — Facet Glass / Glass Tree"],
  a11y: "Canvas is decorative (keep meaningful copy in HTML). Under reduced motion the shell switches to an on-demand frameloop and renders one still frame. Temporal distortion is turned off.",
  perf: "Transmission renders the scene twice; DPR capped at 1.75 and resolution 512. Use one glass object per page.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "geometry", type: "'icosahedron' | 'torus' | 'knot' | 'octahedron'", default: "'icosahedron'", description: "Shape." },
    { name: "faceted", type: "boolean", default: "true", description: "Low-poly flat-shaded cut." },
    { name: "tint", type: "string", default: "'#fff'", description: "Glass colour." },
    { name: "dispersion", type: "number", default: "0.6", description: "Chromatic aberration." },
  ],
};
