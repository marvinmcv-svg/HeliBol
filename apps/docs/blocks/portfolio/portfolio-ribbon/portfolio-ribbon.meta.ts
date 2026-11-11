import type { ComponentMeta } from "@web/types";

export const meta: ComponentMeta = {
  id: "portfolio-ribbon",
  name: "Portfolio \u2014 3D Ribbon",
  description: "Portfolio opener: a giant name behind a spinning 3D ribbon of selected work, an expandable floating nav on top and a rotating discipline word.",
  category: "heroes",
  platforms: ["web"],
  engine: "r3f",
  dependencies: ["three", "@react-three/fiber", "@react-three/drei", "motion"],
  registryDependencies: ["kinetik-core", "three-image-ribbon", "nav-expandable", "text-smart-animate"],
  tags: ["portfolio", "three.js", "ribbon", "hero", "personal"],
  pageTypes: ["portfolio"],
  inspiration: ["MotionSites \u2014 Video Ribbon / Shelf Hero"],
  a11y: "Name is a real H1; the ribbon is decorative so list projects in HTML elsewhere. Reduced motion: ribbon still, words crossfade.",
  perf: "One R3F canvas with 8 textured cylinder slices.",
  status: "stable",
  priority: "P1",
  previewHeight: 580,
};
