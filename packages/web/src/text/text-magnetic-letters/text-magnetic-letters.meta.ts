import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-magnetic-letters",
  name: "Magnetic Letters",
  description: "Every letter is a tiny spring: near the cursor letters are pushed away (or pulled in), tilt and gain weight, then spring back with a soft wobble when it leaves.",
  category: "text",
  platforms: ["web"],
  engine: "js",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","text","cursor","spring","variable font","interactive"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["kinetik Premium collection"],
  a11y: "aria-label holds the full text; letters are aria-hidden. Off on touch and reduced motion.",
  perf: "One rAF loop for all letters that stops when everything settles; transforms + font-variation only.",
  status: "stable",
  priority: "P1",
  previewHeight: 380,
  props: [
    { name: "text", type: "string", description: "Text." },
    { name: "radius", type: "number", default: "140", description: "Influence radius px." },
    { name: "strength", type: "number", default: "1", description: "Positive pushes, negative pulls." },
  ],
};
