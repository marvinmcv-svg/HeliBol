import type { ComponentMeta } from "@web/types";
export const meta: ComponentMeta = {
  id: "testimonials-wall", name: "Testimonials Wall", category: "cards", platforms: ["web"], engine: "motion",
  description: "Masonry wall of testimonials with a star-rating header; cards rise and unblur column by column and lift on hover.",
  dependencies: ["motion"], registryDependencies: ["kinetik-core", "rating-stars"], tags: ["testimonials", "social proof", "reviews", "masonry"],
  pageTypes: ["landing", "pricing"], a11y: "Semantic figure/blockquote/figcaption; stars are a real radio group.", perf: "whileInView once per card; CSS columns.",
  status: "stable", priority: "P1", previewHeight: 600,
};
