import type { ComponentMeta } from "@web/types";

export const meta: ComponentMeta = {
  id: "flow-onboarding",
  name: "Onboarding Pager",
  description: "Swipeable 3-page onboarding: pages slide with a spring, hero images parallax and settle, the dot indicator stretches, and the CTA morphs into “Get started”.",
  category: "layout",
  platforms: ["native", "web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["onboarding", "pager", "swipe", "mobile", "intro"],
  pageTypes: ["onboarding"],
  inspiration: ["Mobbin onboarding flows (Headspace, Revolut, Arc)"],
  a11y: "Dots are a tablist with labels; swipe has button alternatives; haptic on page change.",
  perf: "Transforms only; one page mounted at a time plus the exiting one.",
  status: "stable",
  priority: "P1",
  previewHeight: 700,
  steps: ["Meaning", "Cross-platform", "Accessible"],
};
