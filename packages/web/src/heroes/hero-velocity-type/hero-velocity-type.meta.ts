import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-velocity-type",
  name: "Hero — Velocity Type",
  description: "Sports-performance hero: thin mono nav, a motion-blurred action photo with giant stacked uppercase lines, an orange split CTA, a logo strip and the intro statement below.",
  category: "heroes",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","sports","condensed","mask reveal","streaks","logo marquee"],
  pageTypes: ["landing"],
  inspiration: ["Mobbin — The Performance Lab hero (mobbin.com/sites/sections/abf8940e-4964-4058-8cc8-4ab89f147c70)"],
  a11y: "Real h1 built from masked lines; the logo rail duplicates are aria-hidden; streaks, reveals and marquee stop under reduced motion.",
  perf: "Five blurred streaks and one marquee, all transform-only CSS keyframes.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
