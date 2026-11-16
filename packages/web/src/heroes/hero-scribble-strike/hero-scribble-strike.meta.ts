import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-scribble-strike",
  name: "Hero — Scribble Strike",
  description: "Studio hero: heavy uppercase statement over a cinematic still, where a hand-drawn red strike edits the last word and scribbled notes pop in.",
  category: "heroes",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","studio","hand-drawn","strikethrough","marquee","cinematic"],
  pageTypes: ["portfolio"],
  inspiration: ["Mobbin — Freshman hero (mobbin.com/sites/sections/efd2c199-fe77-4b3a-971a-0ec6bdeb686b)"],
  a11y: "Struck word uses <del> and the note <ins> so screen readers get the edit; band is aria-hidden; reduced motion shows final ink.",
  perf: "SVG stroke draws run once; background zoom + band are transform loops.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
