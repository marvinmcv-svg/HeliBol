import type { ComponentMeta } from "@web/types";

export const meta: ComponentMeta = {
  id: "faq-section",
  name: "FAQ Section",
  description: "Two-column FAQ: highlighted heading on the left, smooth height-auto accordion on the right.",
  category: "layout",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core", "accordion-smooth", "text-highlighter"],
  tags: ["faq", "accordion", "landing", "pricing"],
  pageTypes: ["landing", "pricing", "docs"],
  a11y: "Disclosure pattern; heading hierarchy preserved.",
  perf: "Only the opening panel animates.",
  status: "stable",
  priority: "P1",
  previewHeight: 460,
};
