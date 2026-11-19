import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "three-hologram",
  name: "Hologram",
  description: "Sci-fi hologram: a fresnel-rim shader with scrolling scanlines, flicker and occasional horizontal glitch slices, additive-blended over a projector cone. Knot, head, ring or crystal.",
  category: "3d",
  platforms: ["web"],
  engine: "r3f",
  dependencies: ["three","@react-three/fiber","@react-three/drei"],
  registryDependencies: ["kinetik-core","canvas-3d-shell"],
  tags: ["premium","three.js","hologram","shader","sci-fi","glitch"],
  pageTypes: ["landing","ai-app"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Canvas is decorative. Reduced motion: no glitch, still frame.",
  perf: "One ShaderMaterial; additive, no depth write.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "shape", type: "'knot' | 'head' | 'ring' | 'crystal'", default: "'knot'", description: "Geometry." },
    { name: "color", type: "string", default: "'#22d3ee'", description: "Hologram colour." },
  ],
};
