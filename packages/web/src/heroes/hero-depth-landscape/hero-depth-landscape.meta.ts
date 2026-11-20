import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-depth-landscape",
  name: "Hero — Depth Landscape",
  description: "Editorial landscape hero: five ridge layers, a glowing sun and drifting fog move at different depths with the pointer (spring) and with scroll, while the headline sits between the mountains — in front of the far ridges, behind the near ones.",
  category: "heroes",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","hero","parallax","landscape","travel","editorial"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Headline is real HTML; layers aria-hidden. Pointer parallax off on touch; reduced motion: static scene.",
  perf: "Five SVG layers with transforms from motion values; no re-renders while moving.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "children", type: "ReactNode", description: "Headline/CTA (sits between ridges)." },
    { name: "sky", type: "[string, string]", default: "night → peach", description: "Sky gradient." },
    { name: "ridges", type: "string[]", default: "5 violets", description: "Ridge colours, far → near." },
  ],
};
