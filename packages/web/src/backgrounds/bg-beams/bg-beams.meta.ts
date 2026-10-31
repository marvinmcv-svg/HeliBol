import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-beams",
  name: "Falling Beams",
  description: "Thin light beams fall down a grid of vertical rails at different speeds — data rain for dev-tool heroes.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["beams","lines","dev tools","css-only"],
  pageTypes: ["landing","docs"],
  inspiration: ["Aceternity Background Beams","Vercel"],
  a11y: "Beams hidden under reduced motion; rails stay.",
  perf: "N transform keyframes; deterministic timing (SSR-safe).",
  status: "stable",
  priority: "P2",
  previewHeight: 300,
  props: [
    { name: "count", type: "number", default: "14", description: "Rails." },
    { name: "color", type: "string", description: "Beam color." },
  ],
};
