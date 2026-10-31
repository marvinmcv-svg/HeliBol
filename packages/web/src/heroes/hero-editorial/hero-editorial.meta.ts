import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-editorial",
  name: "Hero — Editorial Studio",
  description: "Agency portfolio opener: an oversized name rising letter by letter, a clip-path image reveal and a slow marquee of disciplines.",
  category: "heroes",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","editorial","agency","portfolio","typography"],
  pageTypes: ["portfolio"],
  inspiration: ["Awwwards studio sites"],
  a11y: "h1 keeps an aria-label of the full name; reduced motion renders the final layout.",
  perf: "Transforms + clip-path; one marquee loop.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "name", type: "string", description: "Studio name." },
    { name: "image", type: "string", description: "Feature image." },
    { name: "disciplines", type: "string[]", description: "Marquee items." },
  ],
};
