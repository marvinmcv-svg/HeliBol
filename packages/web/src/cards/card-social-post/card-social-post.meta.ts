import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "card-social-post",
  name: "Social Post",
  description: "Post card with spring-y like, repost and save actions whose counters roll up and down.",
  category: "cards",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["social","post","like","feed"],
  pageTypes: ["social","blog"],
  inspiration: ["X / Bluesky post actions"],
  a11y: "Each action is a labelled aria-pressed button.",
  perf: "Small transform keyframes on tap.",
  status: "stable",
  priority: "P2",
  previewHeight: 440,
  props: [
    { name: "author / handle / avatar / text / image", type: "string", description: "Post data." },
  ],
};
