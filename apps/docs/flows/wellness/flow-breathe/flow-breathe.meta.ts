import type { ComponentMeta } from "@web/types";
export const meta: ComponentMeta = {
  id: "flow-breathe", name: "Guided Breathing", category: "widgets", platforms: ["native", "web"], engine: "motion",
  description: "4-7-8 breathing coach: concentric rings and a glowing orb expand and contract in time with each phase, with haptic cues on every transition.",
  dependencies: ["motion"], registryDependencies: ["kinetik-core"], tags: ["wellness", "breathing", "meditation", "haptics", "mobile"],
  pageTypes: ["onboarding", "dashboard"], inspiration: ["Apple Mindfulness", "Calm", "Headspace"],
  a11y: "Phase name and countdown in an aria-live region; haptics give a non-visual cue; reduced motion keeps the countdown.", perf: "Long, slow tweens on four elements.",
  status: "stable", priority: "P2", previewHeight: 700, steps: ["Ready", "Inhale", "Exhale"],
};
