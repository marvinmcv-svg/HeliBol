import type { ComponentMeta } from "@web/types";

export const meta: ComponentMeta = {
  id: "hero-liquid-glass",
  name: "Hero \u2014 Liquid Glass",
  description: "Agency hero with a slow Ken Burns photo behind frosted, refracting glass UI \u2014 backdrop blur plus an SVG displacement map and a specular rim on the nav and buttons \u2014 and a blur-rise headline.",
  category: "heroes",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion", "lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["hero", "glass", "liquid glass", "agency", "refraction"],
  pageTypes: ["landing", "portfolio"],
  inspiration: ["MotionSites \u2014 Liquid Glass Agency"],
  a11y: "Glass is decorative styling on real links and buttons; contrast holds over the darkened photo. Reduced motion: no Ken Burns, headline fades in.",
  perf: "backdrop-filter on three small elements; one looping transform on the photo. The url() displacement in backdrop-filter is Chromium-only and degrades to blur elsewhere.",
  status: "stable",
  priority: "P1",
  previewHeight: 580,
};
