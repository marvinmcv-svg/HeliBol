import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-particles",
  name: "Particle Network",
  description: "Drifting particles that link with lines when close and gently flee the cursor — the classic network hero.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "canvas",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["particles","network","canvas","interactive","ai"],
  pageTypes: ["landing","ai-app"],
  inspiration: ["particles.js","tsParticles"],
  a11y: "aria-hidden; static frame under reduced motion.",
  perf: "Density-scaled particle count; O(n²) links capped by density — keep it to hero areas.",
  status: "stable",
  priority: "P2",
  previewHeight: 320,
  props: [
    { name: "density", type: "number", default: "0.00012", description: "Particles per px²." },
    { name: "link", type: "number", default: "110", description: "Link distance (px)." },
    { name: "color", type: "string", description: "RGB triplet." },
  ],
};
