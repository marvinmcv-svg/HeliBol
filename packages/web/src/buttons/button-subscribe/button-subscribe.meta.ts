import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "button-subscribe",
  name: "Subscribe Morph",
  description: "Newsletter input + button pill that morphs into a compact green 'You're on the list' confirmation.",
  category: "buttons",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["newsletter","subscribe","form","morph"],
  pageTypes: ["landing","blog"],
  inspiration: ["Magic UI Animated Subscribe Button"],
  a11y: "Real form with labelled email field; confirmation uses role=status.",
  perf: "Layout morph of one element.",
  status: "stable",
  priority: "P2",
  previewHeight: 260,
  props: [
    { name: "onSubscribe", type: "(email) => Promise<unknown>", description: "Submit handler." },
  ],
};
