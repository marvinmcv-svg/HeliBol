import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "three-galaxy",
  name: "Spiral Galaxy",
  description: "A procedural spiral galaxy: tens of thousands of particles thrown along winding arms, warm core fading to a cool rim, with pointer-driven camera drift.",
  category: "3d",
  platforms: ["web"],
  engine: "r3f",
  dependencies: ["three","@react-three/fiber","@react-three/drei"],
  registryDependencies: ["kinetik-core","canvas-3d-shell"],
  tags: ["three.js","particles","space","hero","background"],
  pageTypes: ["landing"],
  inspiration: ["three.js Journey galaxy generator","MotionSites — Solar Fog"],
  a11y: "Canvas is decorative (keep meaningful copy in HTML). Under reduced motion the shell switches to an on-demand frameloop and renders one still frame.",
  perf: "40k points in one draw call, generated once in useMemo.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "count", type: "number", default: "40000", description: "Stars." },
    { name: "branches", type: "number", default: "4", description: "Spiral arms." },
    { name: "spin", type: "number", default: "1.1", description: "Arm winding." },
    { name: "radius", type: "number", default: "4", description: "Galaxy radius." },
    { name: "inside", type: "string", default: "'#ffb36b'", description: "Core colour." },
    { name: "outside", type: "string", default: "'#3b5bfd'", description: "Rim colour." },
  ],
};
