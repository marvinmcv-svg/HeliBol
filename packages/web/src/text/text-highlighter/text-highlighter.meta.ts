import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-highlighter",
  name: "Marker Highlight",
  description: "A highlighter-pen stroke or underline draws behind key phrases when they come into view. Wraps across lines.",
  category: "text",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["emphasis", "copywriting", "in-view", "marker"],
  pageTypes: ["landing", "blog", "pricing"],
  inspiration: ["Rough Notation", "Editorial highlights"],
  a11y: "Uses semantic <mark>. Reduced motion: highlight appears instantly.",
  perf: "background-size transition; IntersectionObserver toggles one attribute.",
  status: "stable",
  priority: "P2",
  previewHeight: 260,
  props: [
    { name: "variant", type: '"marker" | "underline"', default: '"marker"', description: "Full marker or thin underline." },
    { name: "color", type: "string", description: "Any CSS color." },
    { name: "delay", type: "number", default: "0", description: "Seconds." },
    { name: "duration", type: "number", default: "0.9", description: "Seconds." },
  ],
};
