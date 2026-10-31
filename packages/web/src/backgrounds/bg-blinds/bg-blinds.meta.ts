import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-blinds",
  name: "Light Through Blinds",
  description: "A shifting warm gradient seen through diagonal glass slats — golden-hour editorial backgrounds.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["gradient","blinds","stripes","css-only"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["React Bits Gradient Blinds"],
  a11y: "Decorative; static under reduced motion.",
  perf: "background-position animation on one layer.",
  status: "stable",
  priority: "P2",
  previewHeight: 300,
  props: [
    { name: "colors", type: "[string, string, string]", description: "Gradient colors." },
  ],
};
