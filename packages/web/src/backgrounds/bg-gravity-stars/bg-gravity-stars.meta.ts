import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-gravity-stars",
  name: "Gravity Stars",
  description: "A starfield where the cursor is a gravity well: nearby stars curve toward it with a swirl, streak while moving, then spring home. Stars twinkle at rest.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "canvas",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["stars","canvas","gravity","interactive","space"],
  pageTypes: ["landing"],
  inspiration: ["unlumen UI — Gravity Stars"],
  a11y: "Decorative canvas (aria-hidden). Reduced motion: a single static frame.",
  perf: "useCanvas pauses off-screen/hidden; 220 particles, O(n) per frame.",
  status: "stable",
  priority: "P2",
  previewHeight: 360,
  props: [
    { name: "count", type: "number", default: "220", description: "Stars." },
    { name: "gravity", type: "number", default: "1", description: "Pull strength." },
    { name: "color", type: "string", default: "'255,255,255'", description: "RGB triplet." },
  ],
};
