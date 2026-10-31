import type { ComponentMeta } from "@web/types";
export const meta: ComponentMeta = {
  id: "flow-stories", name: "Stories Viewer", category: "media", platforms: ["native", "web"], engine: "motion",
  description: "Instagram-style stories: segmented progress bars fill in real time, tap left/right to navigate, press and hold to pause, slow Ken Burns zoom.",
  dependencies: ["motion", "lucide-react"], registryDependencies: ["kinetik-core"], tags: ["stories", "instagram", "media", "mobile"],
  pageTypes: ["social", "media"], inspiration: ["Instagram Stories", "Mobbin story viewers"],
  a11y: "Labelled previous/next tap zones; pause on hold; on native expose accessibilityActions for next/previous.", perf: "One image transition + one progress tween at a time.",
  status: "stable", priority: "P1", previewHeight: 700, steps: ["Story 1", "Story 2", "Story 3"],
};
