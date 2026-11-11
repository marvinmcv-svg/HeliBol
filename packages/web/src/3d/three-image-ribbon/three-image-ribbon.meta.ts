import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "three-image-ribbon",
  name: "Image Ribbon",
  description: "Photos wrapped on a tilted, genuinely curved ribbon (open cylinder slices) that drifts and spins faster with wheel or drag.",
  category: "3d",
  platforms: ["web"],
  engine: "r3f",
  dependencies: ["three","@react-three/fiber","@react-three/drei"],
  registryDependencies: ["kinetik-core","canvas-3d-shell"],
  tags: ["three.js","carousel","portfolio","images","ribbon"],
  pageTypes: ["portfolio","media"],
  inspiration: ["MotionSites — Video Ribbon"],
  a11y: "Canvas is decorative — mirror the projects as HTML links. Wheel listener is passive so page scroll still works. Reduced motion: no drift.",
  perf: "One cylinder slice per image; textures shared.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "images", type: "string[]", description: "Images around the ribbon." },
    { name: "radius", type: "number", default: "2.4", description: "Ribbon radius." },
    { name: "height", type: "number", default: "1.2", description: "Panel height." },
    { name: "speed", type: "number", default: "0.15", description: "Idle drift rad/s." },
  ],
};
