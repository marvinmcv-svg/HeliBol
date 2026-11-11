import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-flair-trail",
  name: "Flair Cursor Trail",
  description: "Every few pixels of pointer travel a sprite (emoji, star, shape) pops out, flies in the direction you moved, spins and falls with gravity, then disappears.",
  category: "cursor",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["cursor","trail","emoji","confetti","fun"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["GSAP Demo Hub — Cursor Trail"],
  a11y: "Sprites are aria-hidden and pointer-events:none; nothing spawns under reduced motion.",
  perf: "Spawns are distance-throttled (spacing) and removed on complete; transforms only.",
  status: "stable",
  priority: "P2",
  previewHeight: 380,
  props: [
    { name: "flair", type: "string[]", default: "[\"✦\",\"★\",\"●\",\"◆\",\"✿\"]", description: "Sprites to cycle through." },
    { name: "spacing", type: "number", default: "36", description: "Pointer travel between spawns (px)." },
  ],
};
