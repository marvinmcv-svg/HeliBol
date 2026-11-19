import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "svg-signature",
  name: "Handwritten Signature",
  description: "A signature that writes itself: each stroke draws at a speed proportional to its length, with pen-lift pauses between strokes and a slight ink swell at the end. Starts when visible.",
  category: "svg",
  platforms: ["web"],
  engine: "svg",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","signature","handwriting","svg","draw","contract"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["kinetik Premium collection"],
  a11y: "role=img with a descriptive label. Reduced motion: shown fully drawn.",
  perf: "CSS dash-offset transitions only; lengths measured once.",
  status: "stable",
  priority: "P1",
  previewHeight: 380,
  props: [
    { name: "paths", type: "string[]", default: "built-in signature", description: "Pen strokes in order." },
    { name: "viewBox", type: "string", default: "'0 0 320 130'", description: "SVG viewBox." },
    { name: "speed", type: "number", default: "420", description: "Units per second." },
    { name: "strokeWidth", type: "number", default: "3.2", description: "Pen width." },
  ],
};
