import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "sticky-stack-cards",
  name: "Sticky Stacking Cards",
  description: "Cards pin as you scroll and stack on top of each other; the ones underneath shrink and dim for depth.",
  category: "scroll",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["sticky", "stack", "features", "steps", "scroll"],
  pageTypes: ["landing", "portfolio"],
  inspiration: ["Aceternity sticky scroll", "Codrops stacking cards"],
  a11y: "Content order equals DOM order; plain sticky positioning remains usable with reduced motion (no scale/dim).",
  perf: "Pinning is native position: sticky; only scale + filter animate.",
  status: "stable",
  priority: "P1",
  previewHeight: 440,
  props: [
    { name: "items", type: "ReactNode[]", description: "Cards to stack." },
    { name: "top / step", type: "number", default: "24 / 14", description: "Sticky offset and per-card offset (px)." },
    { name: "container", type: "RefObject<HTMLElement>", description: "Custom scroll container." },
  ],
};
