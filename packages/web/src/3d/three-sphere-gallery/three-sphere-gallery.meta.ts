import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "three-sphere-gallery",
  name: "Sphere Gallery",
  description: "Photos tiled over a sphere (Fibonacci lattice, each tile facing outward) that you grab and spin with inertia, settling back into a slow idle rotation.",
  category: "3d",
  platforms: ["web"],
  engine: "r3f",
  dependencies: ["three","@react-three/fiber","@react-three/drei"],
  registryDependencies: ["kinetik-core","canvas-3d-shell"],
  tags: ["three.js","gallery","drag","portfolio","images"],
  pageTypes: ["portfolio","media"],
  inspiration: ["MotionSites — Sphere Gallery"],
  a11y: "Canvas is decorative — also provide the images as an HTML list or link grid. Drag uses pointer events (touch works, vertical page scroll preserved). Reduced motion: no idle spin.",
  perf: "48 textured planes, textures shared via useTexture; fog hides the back so overdraw is low.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "images", type: "string[]", description: "Image URLs (repeat to fill tiles)." },
    { name: "tiles", type: "number", default: "48", description: "Tile count." },
    { name: "radius", type: "number", default: "2.2", description: "Sphere radius." },
    { name: "autoRotate", type: "number", default: "0.12", description: "Idle spin rad/s." },
  ],
};
