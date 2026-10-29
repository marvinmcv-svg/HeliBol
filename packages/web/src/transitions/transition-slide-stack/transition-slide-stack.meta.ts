import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "transition-slide-stack",
  name: "Push / Pop Stack",
  description: "Native-feeling navigation stack for the web: new screens slide over while the previous one parallaxes 30% and dims.",
  category: "transitions",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["ios", "navigation", "stack", "mobile web", "settings"],
  pageTypes: ["settings", "onboarding", "dashboard"],
  inspiration: ["UINavigationController", "Mobbin settings flows"],
  a11y: "Move focus to the new screen's heading after navigation. Reduced motion: crossfade.",
  perf: "Transforms only; exiting screen unmounts after its animation.",
  status: "stable",
  priority: "P2",
  previewHeight: 400,
  props: [
    { name: "screenKey", type: "string", description: "Identity of the visible screen." },
    { name: "direction", type: "1 | -1", description: "Push (1) or pop (-1)." },
  ],
};
