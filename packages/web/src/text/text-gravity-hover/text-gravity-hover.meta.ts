import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-gravity-hover",
  name: "Text — Gravity Letters",
  description: "Letters that come unstuck: brush a letter and it drops off the line, tumbles and bounces on an invisible floor with a spin, then floats back into place on a spring. A Shake button drops them all.",
  category: "text",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","text","gravity","physics","hover","playful","headline"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Full text in aria-label; Shake button for keyboard users; reduced motion keeps the text still.",
  perf: "Two motion values per letter; animation only while falling.",
  status: "stable",
  priority: "P1",
  previewHeight: 360,
  props: [
    { name: "text", type: "string", description: "Text." },
    { name: "drop", type: "number", default: "1.6", description: "Fall distance in em." },
    { name: "restore", type: "number", default: "1800", description: "ms before letters return." },
  ],
};
