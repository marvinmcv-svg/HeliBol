import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "activity-rings",
  name: "Activity Rings",
  description: "Apple-Watch-style concentric rings that sweep to their goals on view, with an overlapping second lap past 100%.",
  category: "data",
  platforms: ["web"],
  engine: "svg",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["rings","fitness","goals","progress"],
  pageTypes: ["dashboard","onboarding"],
  inspiration: ["Apple Fitness"],
  a11y: "role=img summarizing each ring's percentage; values also listed as text.",
  perf: "pathLength tweens on 3–6 circles.",
  status: "stable",
  priority: "P2",
  previewHeight: 300,
  props: [
    { name: "rings", type: "{ label, value, goal, color }[]", description: "Rings outside-in." },
    { name: "size", type: "number", default: "180", description: "px." },
  ],
};
