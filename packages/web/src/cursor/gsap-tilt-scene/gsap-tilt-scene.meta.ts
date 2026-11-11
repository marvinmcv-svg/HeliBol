import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-tilt-scene",
  name: "3D Tilt Scene",
  description: "A whole composition rotates toward the cursor in 3D; layers marked with data-depth float at different translateZ so they separate as it tilts.",
  category: "cursor",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["3d","tilt","parallax","depth","card"],
  pageTypes: ["landing","portfolio","ecommerce"],
  inspiration: ["GSAP Demo Hub — Cursor-driven perspective tilt"],
  a11y: "Purely visual; content stays readable at rest. Off on touch and under reduced motion (layers still keep their depth offsets).",
  perf: "Two quickTo setters on one element; preserve-3d layers.",
  status: "stable",
  priority: "P2",
  previewHeight: 420,
  props: [
    { name: "children", type: "ReactNode", description: "Layers; add data-depth=\"0..5\"." },
    { name: "max", type: "number", default: "14", description: "Max rotation in degrees." },
  ],
};
