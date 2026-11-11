import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "three-tunnel",
  name: "Warp Tunnel",
  description: "An endless tunnel of glowing polygon rings (one InstancedMesh) streaming toward the camera; the far end bends toward the pointer.",
  category: "3d",
  platforms: ["web"],
  engine: "r3f",
  dependencies: ["three","@react-three/fiber","@react-three/drei"],
  registryDependencies: ["kinetik-core","canvas-3d-shell"],
  tags: ["three.js","tunnel","warp","instanced","background"],
  pageTypes: ["landing"],
  inspiration: ["MotionSites — Scroll-driven 3D"],
  a11y: "Canvas is decorative (keep meaningful copy in HTML). Under reduced motion the shell switches to an on-demand frameloop and renders one still frame.",
  perf: "80 instances in one draw call; matrices + colours updated per frame.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "rings", type: "number", default: "80", description: "Ring count." },
    { name: "speed", type: "number", default: "3", description: "Forward speed." },
    { name: "colors", type: "[string, string]", default: "pink → sky", description: "Ring palette." },
    { name: "sides", type: "number", default: "6", description: "Polygon sides (3–8)." },
  ],
};
