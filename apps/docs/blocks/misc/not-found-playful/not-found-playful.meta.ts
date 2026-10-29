import type { ComponentMeta } from "@web/types";

export const meta: ComponentMeta = {
  id: "not-found-playful",
  name: "404 — Drifting Orb",
  description: "A playful 404: the zero floats as a glowing orb, the message decodes itself, and the CTA is magnetic.",
  category: "text",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion", "gsap", "@gsap/react"],
  registryDependencies: ["kinetik-core", "text-scramble", "button-magnetic", "bg-grid-dots"],
  tags: ["404", "error page", "playful", "empty state"],
  pageTypes: ["landing", "docs"],
  a11y: "The heading reads “404” plus readable message; the orb loop is slow and stops under reduced motion (MotionConfig).",
  perf: "One looping transform.",
  status: "stable",
  priority: "P3",
  previewHeight: 480,
};
