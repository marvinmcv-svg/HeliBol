import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "button-emoji-burst",
  name: "Emoji Burst Button",
  description: "Every click sprays emoji particles from the cursor that arc up, spin and fall away — instant celebration.",
  category: "buttons",
  platforms: ["web"],
  engine: "js",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["confetti","emoji","celebrate","particles","delight"],
  pageTypes: ["social","onboarding","landing"],
  inspiration: ["Magic UI Cool Mode","canvas-confetti"],
  a11y: "Particles are aria-hidden and pointer-events none; skipped under reduced motion.",
  perf: "14 DOM nodes per click, removed after 1.3s; one rAF loop per burst.",
  status: "stable",
  priority: "P2",
  previewHeight: 240,
  props: [
    { name: "emojis", type: "string[]", description: "Particles." },
    { name: "count", type: "number", default: "14", description: "Particles per click." },
  ],
};
