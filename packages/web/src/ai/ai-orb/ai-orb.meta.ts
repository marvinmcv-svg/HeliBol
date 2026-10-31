import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "ai-orb",
  name: "Voice Orb",
  description: "Siri-like voice orb: additive blurred color fields that breathe when idle, swell with input level and swirl while thinking.",
  category: "ai",
  platforms: ["web"],
  engine: "canvas",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["ai","voice","orb","assistant","canvas"],
  pageTypes: ["ai-app"],
  inspiration: ["Siri","ChatGPT voice mode"],
  a11y: "role=img with the current state in its label; static frame under reduced motion.",
  perf: "Three radial gradients per frame on a small canvas; pauses off-screen.",
  status: "stable",
  priority: "P2",
  previewHeight: 340,
  props: [
    { name: "state", type: "\"idle\" | \"listening\" | \"thinking\" | \"speaking\"", default: "\"idle\"", description: "Assistant state." },
    { name: "level", type: "number", default: "0", description: "Input level 0–1." },
    { name: "colors", type: "string[]", description: "Field colors." },
  ],
};
