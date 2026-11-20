import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "media-polaroid-stack",
  name: "Polaroid Stack",
  description: "A messy pile of polaroids with hand-written captions. Fling the top photo in any direction and it flies off and slides back in at the bottom while the rest shuffle up with new tilts.",
  category: "media",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","polaroid","stack","swipe","gallery","photos","drag"],
  pageTypes: ["portfolio","social","media"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Group is focusable with ←/→ and labelled with the current caption; Back/Next buttons. Reduced motion cycles without the throw.",
  perf: "At most 4 cards rendered; drag on one motion value.",
  status: "stable",
  priority: "P1",
  previewHeight: 460,
  props: [
    { name: "photos", type: "{ src; caption; alt? }[]", description: "Photos." },
  ],
};
