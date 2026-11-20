import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-cube-rotate",
  name: "Text — Cube Rotate",
  description: "Rotating word where every letter is the face of a little cube: on each change the cubes tip forward one after another, so the new word rolls in letter by letter while the old one tips away. Different word lengths reflow smoothly.",
  category: "text",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","text","rotate","3d","cube","words","headline"],
  pageTypes: ["landing"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Current word is exposed via aria-label and aria-live; letters are aria-hidden. Reduced motion cross-fades words.",
  perf: "Per-letter rotateX transforms with backface hidden.",
  status: "stable",
  priority: "P1",
  previewHeight: 320,
  props: [
    { name: "words", type: "string[]", description: "Words to cycle." },
    { name: "interval", type: "number", default: "2200", description: "ms per word." },
    { name: "stagger", type: "number", default: "0.045", description: "Letter stagger (s)." },
  ],
};
