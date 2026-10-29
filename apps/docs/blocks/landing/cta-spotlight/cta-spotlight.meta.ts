import type { ComponentMeta } from "@web/types";

export const meta: ComponentMeta = {
  id: "cta-spotlight",
  name: "CTA — Spotlight & Meteors",
  description: "Closing call-to-action panel with a cursor spotlight, meteor shower, animated gradient word and a magnetic button.",
  category: "cursor",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core", "spotlight", "bg-meteors", "text-gradient-animated", "button-magnetic"],
  tags: ["cta", "landing", "spotlight", "footer"],
  pageTypes: ["landing", "pricing"],
  a11y: "Decorative layers aria-hidden; pointer effects off on touch/reduced motion.",
  perf: "CSS meteors + CSS-variable spotlight; one spring-driven button.",
  status: "stable",
  priority: "P1",
  previewHeight: 460,
};
