import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-aurora-type",
  name: "Hero — Aurora Type",
  description: "A massive word filled with a living aurora: drifting, blurred colour blobs show only through the letterforms (white-on-black text multiplied over them), with a soft echo of the light glowing on the floor beneath. Pure CSS.",
  category: "heroes",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","hero","typography","aurora","gradient","css"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["kinetik Premium collection"],
  a11y: "The word is a real H1. Reduced motion: still aurora.",
  perf: "Three blurred blobs with transform keyframes; one blend layer. Zero JS.",
  status: "stable",
  priority: "P1",
  previewHeight: 380,
  props: [
    { name: "word", type: "string", description: "Giant word." },
    { name: "colors", type: "[string, string, string]", default: "cyan, purple, pink", description: "Aurora colours." },
    { name: "children", type: "ReactNode", description: "Subline/CTA." },
  ],
};
