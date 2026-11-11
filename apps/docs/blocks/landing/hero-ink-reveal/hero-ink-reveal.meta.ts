import type { ComponentMeta } from "@web/types";

export const meta: ComponentMeta = {
  id: "hero-ink-reveal",
  name: "Hero \u2014 Ink Reveal",
  description: "Editorial hero where the cursor paints blooming, wobbly ink blots that bleed colour into a monochrome photo; blots spread then slowly dry away. Click to spill more.",
  category: "heroes",
  platforms: ["web"],
  engine: "canvas",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["hero", "ink", "reveal", "cursor", "editorial"],
  pageTypes: ["portfolio", "landing"],
  inspiration: ["MotionSites \u2014 Ink Reveal / Hover Ink"],
  a11y: "Canvas is aria-hidden; copy and CTA are real HTML. Touch and reduced motion show the full-colour image with no effect.",
  perf: "Single canvas; blots expire, image composited with source-in once per frame; DPR capped at 2.",
  status: "stable",
  priority: "P1",
  previewHeight: 580,
};
