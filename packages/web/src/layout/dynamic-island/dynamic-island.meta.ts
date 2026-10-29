import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "dynamic-island",
  name: "Dynamic Island",
  description: "A black pill that morphs between sizes — idle, incoming call, now playing, timer — with Apple's slightly bouncy spring.",
  category: "layout",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["ios", "morph", "notification", "status", "apple"],
  pageTypes: ["landing", "dashboard", "onboarding"],
  inspiration: ["iPhone Dynamic Island", "Family app"],
  a11y: "role=status + aria-live=polite announces new content.",
  perf: "Size + radius animate on one element; contents crossfade with blur.",
  status: "stable",
  priority: "P2",
  previewHeight: 320,
  props: [{ name: "state", type: "{ id, size: { width, height }, radius?, content }", description: "Current island state." }],
};
