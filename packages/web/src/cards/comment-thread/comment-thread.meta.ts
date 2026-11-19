import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "comment-thread",
  name: "Comment Thread",
  description: "Threaded comments: likes pop and their count rolls, the reply composer expands in place, and new replies slide into the thread while siblings make room. Two levels deep.",
  category: "cards",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["comments","thread","reply","social","like"],
  pageTypes: ["social","blog"],
  inspiration: ["21st.dev category gap (audit 2026-11)"],
  a11y: "Each comment is an article labelled by its author; like is aria-pressed with the count in its label; reply toggles aria-expanded. Reduced motion: no layout animation.",
  perf: "Layout animation per item; composer mounts only when open.",
  status: "stable",
  priority: "P2",
  previewHeight: 360,
  props: [
    { name: "comments", type: "Comment[]", description: "Thread data." },
    { name: "me", type: "string", default: "'You'", description: "Author for new replies." },
  ],
};
