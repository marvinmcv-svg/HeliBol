import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-fold-open",
  name: "Hero — Fold Open",
  description: "Foldable-device hero: centered launch copy, then the device unfolds on its hinge in 3D, revealing a photo panel and an app grid.",
  category: "heroes",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","foldable","3d","device","launch","hinge"],
  pageTypes: ["landing","ecommerce"],
  inspiration: ["Mobbin — Apple hero (mobbin.com/sites/sections/1821ad0f-876c-4aeb-b42a-508e791d98a3)"],
  a11y: "Real h1 and links; device is aria-hidden; reduced motion renders it already open.",
  perf: "One rotateY transform with preserve-3d.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
