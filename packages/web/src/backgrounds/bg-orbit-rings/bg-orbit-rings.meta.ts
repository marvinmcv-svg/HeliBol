import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-orbit-rings",
  name: "Background — Orbit Rings",
  description: "Tilted solar-system backdrop: concentric orbits around a glowing core, each spinning at its own speed and direction and carrying a glowing planet with a comet tail. Pure SVG and CSS keyframes in 3D perspective.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","background","orbit","space","integrations","svg","3d"],
  pageTypes: ["landing"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Decorative and aria-hidden. Reduced motion freezes the planets in staggered positions.",
  perf: "CSS keyframe rotations on SVG groups; no JS per frame.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "children", type: "ReactNode", description: "Content above." },
    { name: "rings", type: "number", default: "5", description: "Number of orbits." },
    { name: "colors", type: "string[]", default: "5 neons", description: "Planet colours." },
  ],
};
