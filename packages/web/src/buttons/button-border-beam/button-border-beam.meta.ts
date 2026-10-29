import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "button-border-beam",
  name: "Border Beam Button",
  description: "A comet of light orbits the button's border with a soft glow trail — powered by an animated @property conic gradient.",
  category: "buttons",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["border", "glow", "announcement", "badge", "css-only"],
  pageTypes: ["landing", "pricing"],
  inspiration: ["Magic UI Border Beam", "Vercel ship announcements"],
  a11y: "Decorative only; native button semantics. Reduced motion: static border.",
  perf: "Animates a registered custom property (--k-beam-angle) — compositor-friendly, 0 KB JS.",
  status: "stable",
  priority: "P1",
  previewHeight: 220,
  props: [
    { name: "duration", type: "number", default: "3", description: "Seconds per orbit." },
    { name: "colorFrom / colorTo", type: "string", description: "Beam gradient colors." },
  ],
};
