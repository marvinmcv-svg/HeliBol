import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-wordmark-dashboard",
  name: "Hero — Wordmark + Dashboard",
  description: "Product-launch hero: a giant condensed wordmark drops in letter by letter, then a violet stage rises with a condensed tagline and a full store-admin mock whose chart draws itself.",
  category: "heroes",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","launch","wordmark","dashboard","chart","product"],
  pageTypes: ["landing","dashboard"],
  inspiration: ["Mobbin — Shopify Editions hero (mobbin.com/sites/sections/82b3e7d8-f568-45a0-bed6-6da9b11f4634)"],
  a11y: "h1 has aria-label with the full word, letters aria-hidden; mock dashboard is aria-hidden; reduced motion shows the final state.",
  perf: "Per-letter CSS transforms and one SVG line draw.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
