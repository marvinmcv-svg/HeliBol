import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "cursor-eyes",
  name: "Following Eyes",
  description: "A pair of googly eyes whose pupils track the cursor anywhere on the page, blinking every few seconds.",
  category: "cursor",
  platforms: ["web"],
  engine: "js",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["eyes","playful","404","mascot"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["Animata hover interaction","classic xeyes"],
  a11y: "Fully decorative (aria-hidden); off on touch and reduced motion.",
  perf: "One window pointermove listener; translate on two pupils.",
  status: "stable",
  priority: "P3",
  previewHeight: 260,
  props: [
    { name: "size", type: "number", default: "64", description: "Eye diameter (px)." },
  ],
};
