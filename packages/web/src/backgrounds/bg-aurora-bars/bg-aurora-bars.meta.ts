import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-aurora-bars",
  name: "Aurora Bars",
  description: "Soft vertical light bars rising from the bottom edge, each breathing at its own pace — an aurora curtain built from scaleY-only CSS keyframes.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["aurora","gradient","css","hero","glow"],
  pageTypes: ["landing"],
  inspiration: ["unlumen UI — Aurora Bars"],
  a11y: "aria-hidden decoration; reduced motion freezes bars mid-height.",
  perf: "Pure CSS transforms; deterministic per-bar values so SSR matches.",
  status: "stable",
  priority: "P2",
  previewHeight: 360,
  props: [
    { name: "bars", type: "number", default: "28", description: "Bar count." },
    { name: "colors", type: "[string, string, string]", default: "violet, pink, cream", description: "Base, middle, tip." },
  ],
};
