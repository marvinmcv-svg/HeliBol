import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "card-profile",
  name: "Profile Card",
  description: "Profile card with a zooming cover, a Follow button that morphs to Following, and follower counts that roll.",
  category: "cards",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["profile","social","follow","stats"],
  pageTypes: ["social","dashboard"],
  inspiration: ["X / Threads profile cards"],
  a11y: "Follow is an aria-pressed button; stats in a <dl>.",
  perf: "Layout morph on the button; per-stat rolling text.",
  status: "stable",
  priority: "P2",
  previewHeight: 400,
  props: [
    { name: "name / handle / avatar / cover / bio", type: "string", description: "Profile data." },
    { name: "stats", type: "{ label, value }[]", description: "Stats." },
  ],
};
