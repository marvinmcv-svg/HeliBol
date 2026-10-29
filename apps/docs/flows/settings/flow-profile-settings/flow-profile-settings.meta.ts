import type { ComponentMeta } from "@web/types";

export const meta: ComponentMeta = {
  id: "flow-profile-settings",
  name: "Profile & Settings",
  description: "iOS-style profile: the avatar shrinks and the large title hands off to a compact blurred header as you scroll; spring toggles with haptics.",
  category: "navigation",
  platforms: ["native", "web"],
  engine: "motion",
  dependencies: ["motion", "lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["settings", "profile", "collapsing header", "toggles", "mobile"],
  pageTypes: ["settings"],
  inspiration: ["iOS Settings", "Mobbin profile flows"],
  a11y: "Switches use role=switch + aria-checked; header title is always present for screen readers.",
  perf: "All scroll-linked values derive from one scroll motion value (on native: useAnimatedScrollHandler on the UI thread).",
  status: "stable",
  priority: "P2",
  previewHeight: 700,
  steps: ["Profile", "Dark mode on"],
};
