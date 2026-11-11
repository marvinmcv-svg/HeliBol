import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "three-orbit-sphere",
  name: "Orbit Sphere",
  description: "A dotted planet with tilted orbit rings and satellites — the classic \"global network / coverage\" hero visual.",
  category: "3d",
  platforms: ["web"],
  engine: "r3f",
  dependencies: ["three","@react-three/fiber","@react-three/drei"],
  registryDependencies: ["kinetik-core","canvas-3d-shell"],
  tags: ["three.js","globe","orbit","network","saas"],
  pageTypes: ["landing","dashboard"],
  inspiration: ["MotionSites — Orbit Sphere"],
  a11y: "Canvas is decorative (keep meaningful copy in HTML). Under reduced motion the shell switches to an on-demand frameloop and renders one still frame.",
  perf: "~2.4k points plus a few dozen tiny spheres; ring groups rotate as wholes.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "dots", type: "number", default: "2400", description: "Dots on the planet." },
    { name: "rings", type: "number[]", default: "[5, 8, 12]", description: "Satellites per ring." },
    { name: "color", type: "string", default: "'#e4e4e7'", description: "Dot/ring colour." },
    { name: "accent", type: "string", default: "'#f97316'", description: "Lead satellite colour." },
  ],
};
