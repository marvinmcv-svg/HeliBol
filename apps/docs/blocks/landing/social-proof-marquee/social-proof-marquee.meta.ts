import type { ComponentMeta } from "@web/types";

export const meta: ComponentMeta = {
  id: "social-proof-marquee",
  name: "Logo Cloud + Testimonial Wall",
  description: "Logo marquee with a pause control, then two opposite-direction testimonial marquees with faded edges.",
  category: "media",
  platforms: ["web"],
  engine: "css",
  dependencies: ["lucide-react"],
  registryDependencies: ["kinetik-core", "marquee"],
  tags: ["testimonials", "logos", "social proof", "marquee"],
  pageTypes: ["landing", "pricing"],
  a11y: "Pause control (WCAG 2.2.2); duplicate tracks aria-hidden; paused under reduced motion.",
  perf: "Pure CSS transforms.",
  status: "stable",
  priority: "P1",
  previewHeight: 560,
};
